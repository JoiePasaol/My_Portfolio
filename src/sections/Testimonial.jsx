import { useState, useEffect, useCallback, memo, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import Swal from "sweetalert2";
import emailjs from "@emailjs/browser";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ─── CustomModal ────────────────────────────────────────────────────────────
const CustomModal = memo(({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 backdrop-blur-xl transition-opacity"
        onClick={onClose}
      />
      <div className="relative bg-black rounded-xl shadow-lg max-w-md w-full mx-4 transform transition-all">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Close modal"
        >
          <i className="bx bx-x text-2xl"></i>
        </button>
        {children}
      </div>
    </div>
  );
});
CustomModal.displayName = "CustomModal";

// ─── StarRating ──────────────────────────────────────────────────────────────
const StarRating = memo(({ rating, onRatingChange }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="focus:outline-none transition-transform duration-100 hover:scale-125 active:scale-95"
          aria-label={`Rate ${star} out of 5`}
        >
          <i
            className={`bx bxs-star text-2xl transition-colors duration-150 ${
              star <= (hovered || rating) ? "text-yellow-400" : "text-gray-600"
            }`}
          />
        </button>
      ))}
 <span className="ml-2 text-sm text-gray-400">
  {(hovered || rating) ? ["", "Poor", "Fair", "Good", "Great", "Excellent"][hovered || rating] : ""}
</span>
    </div>
  );
});
StarRating.displayName = "StarRating";

// ─── Testimonials ────────────────────────────────────────────────────────────
const Testimonials = memo(() => {
  const [testimonials, setTestimonials] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    content: "",
    position: "",
    rating: 0,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  // ── Fetch only approved testimonials ──────────────────────────────────────
  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Error fetching testimonials:", error);
      } else {
        setTestimonials(data);
      }
    };
    fetchTestimonials();
  }, []);

  // ── Handle input changes ──────────────────────────────────────────────────
  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    [errors]
  );

  // ── Handle rating change ──────────────────────────────────────────────────
  const handleRatingChange = useCallback((value) => {
    setFormData((prev) => ({ ...prev, rating: value }));
    setErrors((prev) => ({ ...prev, rating: "" }));
  }, []);

  // ── Validate form ─────────────────────────────────────────────────────────
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
    if (!formData.rating || formData.rating === 0) {
      newErrors.rating = "Please select a rating";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // ── Handle submit ─────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    // Insert and get back the new row's id
    const { data: inserted, error } = await supabase
      .from("testimonials")
      .insert([
        {
          name: formData.name,
          email: formData.email,
          content: formData.content,
          position: formData.position,
          rating: formData.rating,
          status: "pending",
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            formData.name
          )}&background=1f2937&color=fff&size=100`,
        },
      ])
      .select()
      .single();

    if (error) {
      setIsSubmitting(false);
      console.error("Error submitting testimonial:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to submit testimonial. Please try again.",
        confirmButtonColor: "#1f2937",
      });
      return;
    }

    // Build approve/decline URLs using the inserted row id
    const baseUrl =
      "https://oltfyuyytszirisxiamc.supabase.co/functions/v1/approve-testimonial";
    const approveUrl = `${baseUrl}?id=${inserted.id}&action=approved`;
    const declineUrl = `${baseUrl}?id=${inserted.id}&action=declined`;

    // Send email notification with approve/decline links
    await emailjs.send(
      "service_qpwpl5l",
      "template_d44x4zm",        // ← removed the stray '; from your original
      {
        from_name: formData.name,
        from_email: formData.email,
        position: formData.position,
        rating: formData.rating,
        message: formData.content,
        approve_url: approveUrl,
        decline_url: declineUrl,
      },
      "z0MRG5TR-7H0QNyHe"
    );

    setFormData({ name: "", email: "", content: "", position: "", rating: 0 });
    closeModal();
    setIsSubmitting(false);

    Swal.fire({
      icon: "success",
      title: "Thank You!",
      text: "Your testimonial has been submitted for review!",
      confirmButtonColor: "#1f2937",
    });
  }, [validateForm, formData, closeModal]);

  // ── Render stars (read-only display) ──────────────────────────────────────
  const renderStars = useCallback(
    (rating) =>
      [...Array(5)].map((_, index) => (
        <i
          key={index}
          className={`bx bxs-star text-sm ${
            index < rating ? "text-yellow-400" : "text-gray-300"
          }`}
        />
      )),
    []
  );

  // ── Testimonials list ─────────────────────────────────────────────────────
  const testimonialsList = useMemo(
    () =>
      testimonials.map((testimonial, index) => (
        <div
          key={testimonial.id}
          className="bg-transparent shadow-lg border-1 border-black rounded-lg p-4 transition-all duration-300"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="mb-2">
            <i className="bx bxs-quote-alt-left text-2xl text-gray-300 dark:text-gray-600" />
          </div>
          <p className="text-black mb-4 leading-relaxed text-sm">
            {testimonial.content}
          </p>
          <div className="flex items-center gap-1 mb-3">
            {renderStars(testimonial.rating)}
          </div>
          <div className="flex items-center gap-3">
            <img
              src={testimonial.avatar}
              alt={`Avatar of ${testimonial.name}`}
              className="w-10 h-10 rounded-full shadow-lg object-cover ring-2 ring-black"
              loading="lazy"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  testimonial.name
                )}&background=fff&color=000&size=48`;
              }}
            />
            <div>
              <h4 className="font-semibold text-black text-sm">
                {testimonial.name}
              </h4>
              <p className="text-xs text-black">{testimonial.position}</p>
            </div>
          </div>
        </div>
      )),
    [testimonials, renderStars]
  );

  // ── JSX ───────────────────────────────────────────────────────────────────
  return (
    <section
      id="testimonials"
      className="pt-5 min-h-screen overflow-hidden px-4 sm:px-6 lg:px-8 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div
          className="text-center mb-16"
          data-aos-delay="600"
          data-aos="fade-down"
        >
          <h2 className="text-5xl md:text-5xl font-bold text-black mb-4">
            What People Say
          </h2>
          <p className="text-lg text-black md:w-1/2 mx-auto">
            Words from clients, teammates, and friends who've worked with me and
            witnessed my passion in action.
          </p>
        </div>

        {/* Testimonial Card */}
        <div
          className="bg-white rounded-lg mb-10 shadow-lg border border-black max-w-4xl mx-auto"
          data-aos-delay="600"
          data-aos="fade-up"
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-600">
            <h3 className="text-xl font-semibold text-black flex items-center gap-2">
              <i className="bx bx-comment-detail text-2xl" />
              Testimonials
            </h3>
            <button
              onClick={openModal}
              className="cursor-pointer px-6 py-2 ml-3 text-white bg-black rounded-md font-medium flex items-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
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
                <p className="text-lg font-semibold text-gray-800 mb-2">
                  No Testimonials Yet
                </p>
                <p className="text-sm text-gray-800 max-w-sm mx-auto">
                  Be the first to share your experience and inspire others with
                  your story!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <CustomModal isOpen={isModalOpen} onClose={closeModal}>
        <div className="p-6 sm:p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gray-800 dark:bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="bx bx-message-dots text-xl text-white dark:text-gray-800" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Share Your Testimonial
            </h3>
            <p className="text-sm text-white">
              How was your experience working with me? Your voice matters.
            </p>
          </div>

          <div className="grid gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Full Name
              </label>
              <div className="relative">
                <i className="bx bx-id-card absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    errors.name
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-200 focus:border-gray-800"
                  } bg-white text-black text-sm focus:outline-none focus:ring-1 transition-colors`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <i className="bx bx-error-circle" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Email
              </label>
              <div className="relative">
                <i className="bx bx-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    errors.email
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-200 focus:border-gray-800"
                  } bg-white text-black text-sm focus:outline-none focus:ring-1 transition-colors`}
                  placeholder="name@email.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <i className="bx bx-error-circle" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Position
              </label>
              <div className="relative">
                <i className="bx bx-briefcase absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    errors.position
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-200 focus:border-gray-800"
                  } bg-white text-black text-sm focus:outline-none focus:ring-1 transition-colors`}
                  placeholder="HR, Developer, Designer, etc."
                />
              </div>
              {errors.position && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <i className="bx bx-error-circle" />
                  {errors.position}
                </p>
              )}
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Your Rating
              </label>
              <StarRating
                rating={formData.rating}
                onRatingChange={handleRatingChange}
              />
              {errors.rating && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <i className="bx bx-error-circle" />
                  {errors.rating}
                </p>
              )}
            </div>

            {/* Testimonial */}
            <div>
              <label className="block text-sm text-white font-medium mb-1">
                Testimonial
              </label>
              <div className="relative">
                <i className="bx bx-message-detail absolute left-3 top-4 text-gray-400" />
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows="4"
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    errors.content
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-200 focus:border-gray-800"
                  } bg-white text-black text-sm focus:outline-none focus:ring-1 transition-colors resize-none`}
                  placeholder="Share your experience..."
                />
              </div>
              {errors.content && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <i className="bx bx-error-circle" />
                  {errors.content}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-6 py-2 border border-white text-white hover:text-black hover:bg-white rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 px-6 py-2 bg-white text-black rounded-lg text-sm font-medium transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="bx bx-loader-alt animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <i className="bx bx-send" />
                    Submit
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </CustomModal>
    </section>
  );
});

Testimonials.displayName = "Testimonials";

export default Testimonials;