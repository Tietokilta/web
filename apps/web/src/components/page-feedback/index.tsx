"use client";

import { useState } from "react";
import { Button, Textarea } from "@tietokilta/ui";
import { useI18n } from "@locales/client";

type Vote = "up" | "down" | null;

interface PageFeedbackProps {
  path: string;
}

export function PageFeedback({ path }: PageFeedbackProps) {
  const t = useI18n();
  const [vote, setVote] = useState<Vote>(null);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmittedComment, setHasSubmittedComment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVote = async (selectedVote: "up" | "down") => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/next_api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path, vote: selectedVote }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      setVote(selectedVote);
      // Show comment form after voting
      if (!hasSubmittedComment) {
        setShowCommentForm(true);
      }
    } catch {
      setError(t("feedback.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!vote || !comment.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/next_api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path, vote, comment: comment.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit comment");
      }

      setHasSubmittedComment(true);
      setShowCommentForm(false);
      setComment("");
    } catch {
      setError(t("feedback.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipComment = () => {
    setShowCommentForm(false);
  };

  // Already voted and submitted comment - show thank you
  if (vote && hasSubmittedComment) {
    return (
      <div className="mt-8 border-t-2 border-gray-200 pt-6">
        <p className="text-center text-gray-600">{t("feedback.thankYou")}</p>
      </div>
    );
  }

  return (
    <div className="mt-8 border-t-2 border-gray-200 pt-6">
      <div className="flex flex-col items-center gap-4">
        {/* Question */}
        <p className="font-medium text-gray-800">{t("feedback.wasThisHelpful")}</p>

        {/* Vote buttons */}
        {!vote && (
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleVote("up")}
              disabled={isSubmitting}
              aria-label={t("feedback.helpful")}
            >
              <span className="mr-2">👍</span>
              {t("feedback.yes")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleVote("down")}
              disabled={isSubmitting}
              aria-label={t("feedback.notHelpful")}
            >
              <span className="mr-2">👎</span>
              {t("feedback.no")}
            </Button>
          </div>
        )}

        {/* Voted state - show which was selected */}
        {vote && !showCommentForm && !hasSubmittedComment && (
          <div className="flex items-center gap-2 text-gray-600">
            <span>{vote === "up" ? "👍" : "👎"}</span>
            <span>{t("feedback.thankYou")}</span>
          </div>
        )}

        {/* Comment form */}
        {showCommentForm && (
          <div className="w-full max-w-md space-y-3">
            <p className="text-center text-sm text-gray-600">
              {t("feedback.wantToTellMore")}
            </p>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t("feedback.commentPlaceholder")}
              maxLength={1000}
              rows={3}
              disabled={isSubmitting}
            />
            <div className="flex justify-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSkipComment}
                disabled={isSubmitting}
              >
                {t("feedback.skip")}
              </Button>
              <Button
                size="sm"
                onClick={handleCommentSubmit}
                disabled={isSubmitting || !comment.trim()}
              >
                {t("feedback.send")}
              </Button>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
