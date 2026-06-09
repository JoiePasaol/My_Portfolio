import { memo, useState, useEffect } from "react";

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
        {(hovered || rating)
          ? ["", "Poor", "Fair", "Good", "Great", "Excellent"][hovered || rating]
          : ""}
      </span>
    </div>
  );
});
StarRating.displayName = "StarRating";

// ─── CustomModal ─────────────────────────────────────────────────────────────
const CustomModal = memo(({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 backdrop-blur-xl transition-opacity"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-black border border-white/10 rounded-xl shadow-lg max-w-md w-full mx-4 transform transition-all">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black dark:text-gray-500 dark:hover:text-white transition-colors cursor-pointer"
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

// ─── TestimonialModal ─────────────────────────────────────────────────────────
const TestimonialModal = memo(({
  isOpen,
  onClose,
  formData,
  errors,
  isSubmitting,
  onInputChange,
  onRatingChange,
  onSubmit,
}) => {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 sm:p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-black dark:bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="bx bx-message-dots text-xl text-white dark:text-black" />
          </div>
          <h3 className="text-xl font-bold text-black dark:text-white mb-2">
            Share Your Testimonial
          </h3>
          <p className="text-sm text-gray-400">
            How was your experience working with me? Your voice matters.
          </p>
        </div>

        <div className="grid gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-1">
              Full Name
            </label>
            <div className="relative">
              <i className="bx bx-id-card absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={onInputChange}
               className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                errors.name
                    ? "border-red-500 focus:border-red-500"
                    : "border-black dark:border-white/20 focus:border-black dark:focus:border-white"
                } bg-transparent text-black dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/30 transition-colors`}
                placeholder="Enter your full name"
              />
            </div>
            {errors.name && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <i className="bx bx-error-circle" />{errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
          <label className="block text-sm font-medium text-black dark:text-white mb-1">
              Email
            </label>
            <div className="relative">
              <i className="bx bx-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onInputChange}
                 className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                errors.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-black dark:border-white/20 focus:border-black dark:focus:border-white"
                } bg-transparent text-black dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/30 transition-colors`}
                placeholder="name@email.com"
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <i className="bx bx-error-circle" />{errors.email}
              </p>
            )}
          </div>

          {/* Position */}
          <div>
           <label className="block text-sm font-medium text-black dark:text-white mb-1">
              Position/Company
            </label>
            <div className="relative">
              <i className="bx bx-briefcase absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={onInputChange}
                 className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                errors.position
                    ? "border-red-500 focus:border-red-500"
                    : "border-black dark:border-white/20 focus:border-black dark:focus:border-white"
                } bg-transparent text-black dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/30 transition-colors`}
                placeholder="HR, Developer, Designer, etc. Company"
              />
            </div>
            {errors.position && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <i className="bx bx-error-circle" />{errors.position}
              </p>
            )}
          </div>

          {/* Rating */}
          <div>
           <label className="block text-sm font-medium text-black dark:text-white mb-1">
              Your Rating
            </label>
            <StarRating rating={formData.rating} onRatingChange={onRatingChange} />
            {errors.rating && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <i className="bx bx-error-circle" />{errors.rating}
              </p>
            )}
          </div>

          {/* Testimonial */}
          <div>
             <label className="block text-sm font-medium text-black dark:text-white mb-1">
              Testimonial
            </label>
            <div className="relative">
              <i className="bx bx-message-detail absolute left-3 top-4 text-gray-400" />
              <textarea
                name="content"
                value={formData.content}
                onChange={onInputChange}
                rows="4"
               className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                errors.content
                    ? "border-red-500 focus:border-red-500"
                    : "border-black dark:border-white/20 focus:border-black dark:focus:border-white"
                } bg-transparent text-black dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/30 transition-colors`}
                placeholder="Share your experience..."
              />
            </div>
            {errors.content && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <i className="bx bx-error-circle" />{errors.content}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-2 border border-black text-black dark:border-white dark:text-white hover:bg-white/10 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              className="flex-1 px-6 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
  );
});

TestimonialModal.displayName = "TestimonialModal";

export default TestimonialModal;