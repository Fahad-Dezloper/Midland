"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Star } from "lucide-react";
import { useState } from "react";

const ReviewSection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sample data for ratings distribution
  const ratingDistribution = [
    { stars: 5, percentage: 90 },
    { stars: 4, percentage: 60 },
    { stars: 3, percentage: 40 },
    { stars: 2, percentage: 30 },
    { stars: 1, percentage: 0 }
  ];

  // Sample customer reviews
  const customerReviews = [
    {
      name: "Rachel Patel",
      date: "October 5, 2023",
      rating: 5,
      avatar: "RP",
      avatarColor: "bg-blue-200",
      review: "Absolutely love this watch! The design is elegant and the build quality is exceptional. I would definitely purchase from this brand again."
    },
    {
      name: "Christopher Lee",
      date: "June 25, 2023",
      rating: 4.5,
      avatar: "CL",
      avatarColor: "bg-purple-200",
      review: "Great quality and style. Very versatile and durable. The only minor issue is the clasp is a bit tricky to open, which is why I docked half a star."
    },
    {
      name: "Brian Chen",
      date: "April 15, 2022",
      rating: 3.5,
      avatar: "BC",
      avatarColor: "bg-red-200",
      review: "Sleek design and comfortable to wear. However, the strap feels somewhat flimsy and the clasp is occasionally difficult to secure. Keeps accurate time though."
    }
  ];

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : i < rating 
              ? 'text-yellow-400 fill-current' 
              : 'text-gray-300'
        }`}
      />
    ));
  };

  const renderInteractiveStars = (currentRating: number, onRatingChange: (rating: number) => void) => {
    return [...Array(5)].map((_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => onRatingChange(i + 1)}
        className="transition-colors duration-200 hover:scale-110"
      >
        <Star
          className={`w-6 h-6 ${
            i < currentRating 
              ? 'text-yellow-400 fill-current' 
              : 'text-gray-300 hover:text-yellow-300'
          }`}
        />
      </button>
    ));
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }
    if (!comment.trim()) {
      alert("Please write a review");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would typically send the review to your backend
      console.log("Review submitted:", { rating, comment });
      
      // Reset form and close dialog
      setRating(0);
      setComment("");
      setIsDialogOpen(false);
      
      // Show success message
      alert("Thank you for your review!");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      // Reset form when dialog closes
      setRating(0);
      setComment("");
    }
  };

  return (
    <div className="flex gap-12 ">
      {/* Left Column - Average Rating */}
      <div className="max-w-[30vw] h-fit border p-6 rounded-lg">
        {/* Overall Score */}
        <div className="text-center flex gap-4">
          <div className="text-3xl font-bold text-gray-900 mb-2">4.5</div>
          <div className="flex flex-col">
          <div className="flex justify-center">
            {renderStars(4.5)}
          </div>
          <div className="text-sm font-semibold text-gray-600">50k Reviews</div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-3 mb-6">
          {ratingDistribution.map((item) => (
            <div key={item.stars} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-8">
                <span className="text-sm font-medium">{item.stars}</span>
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-600 w-12 text-right">
                {item.percentage}%
              </div>
            </div>
          ))}
        </div>

        {/* Write Review Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Write your Review</h3>
          <p className="text-sm text-gray-600 mb-4">
            Share your feedback and help create a better shopping experience for everyone.
          </p>
          
          <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/80 text-white px-6 py-2 rounded-lg">
                Submit Review
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Write Your Review</DialogTitle>
                <DialogDescription>
                  Pen your thoughts about this book! Was it a page-turner, a life-changer, or a gentle companion on a rainy day? Your review helps fellow readers discover their next great read.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rating</label>
                  <div className="flex justify-center gap-1">
                    {renderInteractiveStars(rating, setRating)}
                  </div>
                  {rating > 0 && (
                    <p className="text-sm text-gray-600 text-center">
                      You rated this product {rating} star{rating > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="comment" className="text-sm font-medium">
                    Your Review
                  </label>
                  <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about this book..."
                    className="min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none  disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmitReview}
                  disabled={isSubmitting || rating === 0 || !comment.trim()}
                  className="bg-primary hover:bg-primary/80 text-white"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Right Column - Customer Feedback */}
      <div className="w-full">
        <div className="space-y-4">
          {customerReviews.map((review, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 ${review.avatarColor} rounded-full flex items-center justify-center`}>
                  <span className="text-gray-700 font-medium text-sm">{review.avatar}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-medium text-gray-900">{review.name}</div>
                      <div className="text-sm text-gray-500">{review.date}</div>
                    </div>
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {review.review}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ReviewSection