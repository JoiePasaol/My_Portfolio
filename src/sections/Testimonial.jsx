import { useState, useEffect, useCallback, memo, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import Swal from "sweetalert2";
import emailjs from "@emailjs/browser";
import TestimonialModal from "../components/TestimonialModal";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const Testimonials = memo(() => {
  const [testimonials, setTestimonials] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", content: "", position: "", rating: 0,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openModal  = useCallback(() => setIsModalOpen(true),  []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  // Fetch approved testimonials
  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      if (error) console.error("Error fetching testimonials:", error);
      else setTestimonials(data);
    };
    fetchTestimonials();
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }, [errors]);

  const handleRatingChange = useCallback((value) => {
    setFormData((prev) => ({ ...prev, rating: value }));
    setErrors((prev) => ({ ...prev, rating: "" }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.content.trim()) {
      newErrors.content = "Testimonial is required";
    } else if (formData.content.trim().length < 10) {
      newErrors.content = "Testimonial must be at least 10 characters";
    }
    if (!formData.position.trim()) newErrors.position = "Position is required";
    if (!formData.rating || formData.rating === 0) newErrors.rating = "Please select a rating";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    const { data: inserted, error } = await supabase
      .from("testimonials")
      .insert([{
        name: formData.name,
        email: formData.email,
        content: formData.content,
        position: formData.position,
        rating: formData.rating,
        status: "pending",
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=1f2937&color=fff&size=100`,
      }])
      .select()
      .single();

    if (error) {
      setIsSubmitting(false);
      console.error("Error submitting testimonial:", error);
      Swal.fire({ icon: "error", title: "Oops...", text: "Failed to submit testimonial. Please try again.", confirmButtonColor: "#1f2937" });
      return;
    }

    const baseUrl = import.meta.env.VITE_APPROVE_TESTIMONIAL_URL;
    const approveUrl = `${baseUrl}?id=${inserted.id}&action=approved`;
    const declineUrl = `${baseUrl}?id=${inserted.id}&action=declined`;

    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        from_name: formData.name,
        from_email: formData.email,
        position: formData.position,
        rating: formData.rating,
        message: formData.content,
        approve_url: approveUrl,
        decline_url: declineUrl,
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );

    setFormData({ name: "", email: "", content: "", position: "", rating: 0 });
    closeModal();
    setIsSubmitting(false);
    Swal.fire({ icon: "success", title: "Thank You!", text: "Your testimonial has been submitted for review!", confirmButtonColor: "#1f2937" });
  }, [validateForm, formData, closeModal]);

  const renderStars = useCallback(
    (rating) =>
      [...Array(5)].map((_, index) => (
        <i
          key={index}
          className={`bx bxs-star text-sm ${index < rating ? "text-yellow-400" : "text-gray-600"}`}
        />
      )),
    []
  );

  const testimonialsList = useMemo(
    () =>
      testimonials.map((testimonial, index) => (
        <div
          key={testimonial.id}
          className="bg-transparent border border-black dark:border-white/10 rounded-lg p-4 transition-all duration-300 hover:border-black dark:hover:border-white/30 shadow-sm"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="mb-2">
            <i className="bx bxs-quote-alt-left text-2xl text-gray-300 dark:text-gray-600" />
          </div>
          <p className="text-black dark:text-gray-300 mb-4 leading-relaxed text-sm">
            {testimonial.content}
          </p>
          <div className="flex items-center gap-1 mb-3">
            {renderStars(testimonial.rating)}
          </div>
          <div className="flex items-center gap-3">
            <img
              src={testimonial.avatar}
              alt={`Avatar of ${testimonial.name}`}
              className="w-10 h-10 rounded-full shadow-lg object-cover ring-2 ring-black dark:ring-white/20"
              loading="lazy"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=fff&color=000&size=48`;
              }}
            />
            <div>
              <h4 className="font-semibold text-black dark:text-white text-sm">
                {testimonial.name}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {testimonial.position}
              </p>
            </div>
          </div>
        </div>
      )),
    [testimonials, renderStars]
  );

  return (
    <section
      id="testimonials"
      className="pt-5 scroll-mt-20 min-h-screen overflow-hidden px-4 sm:px-6 lg:px-8 bg-white dark:bg-black transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16" data-aos-delay="600" data-aos="fade-down">
          <h2 className="text-5xl font-bold text-black dark:text-white mb-4">
            What People Say
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 md:w-1/2 mx-auto">
            Words from clients, teammates, and friends who've worked with me and
            witnessed my passion in action.
          </p>
        </div>

        {/* Testimonial Card */}
        <div
          className="bg-white dark:bg-black rounded-lg mb-10 shadow-lg border border-black dark:border-white/10 max-w-4xl mx-auto"
          data-aos-delay="600"
          data-aos="fade-up"
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-white/10">
            <h3 className="text-xl font-semibold text-black dark:text-white flex items-center gap-2">
              <i className="bx bx-comment-detail text-2xl" />
              Testimonials
            </h3>
            <button
              onClick={openModal}
              className="cursor-pointer px-6 py-2 ml-3 text-white bg-black dark:bg-white dark:text-black rounded-md font-medium flex items-center gap-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:bg-black/80 dark:hover:bg-white/80"
              aria-label="Add a new testimonial"
            >
              <i className="bx bx-plus text-lg" />
              Add Testimonial
            </button>
          </div>

          <div className="max-h-[500px] overflow-y-auto scrollbar-hide p-6">
            {testimonials.length > 0 ? (
              <div className="space-y-6">{testimonialsList}</div>
            ) : (
              <div className="text-center py-12">
                <i className="bx bx-message-dots text-6xl text-gray-300 dark:text-gray-600 mb-4 animate-pulse" />
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  No Testimonials Yet
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                  Be the first to share your experience and inspire others with your story!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <TestimonialModal
        isOpen={isModalOpen}
        onClose={closeModal}
        formData={formData}
        errors={errors}
        isSubmitting={isSubmitting}
        onInputChange={handleInputChange}
        onRatingChange={handleRatingChange}
        onSubmit={handleSubmit}
      />
    </section>
  );
});

Testimonials.displayName = "Testimonials";

export default Testimonials;