"use client";

import { useState, useTransition } from "react";
import type { ChangeEvent, JSX } from "react";
import { FileText, Sparkles, Upload } from "lucide-react";
import { uploadResume } from "@/actions/profile";
import type { ProfileFormValues } from '@/types';

const MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024;

type Props = {
  hasUploadedResume: boolean;
  signedResumeUrl: string | null;
  onProfileExtracted: (profile: ProfileFormValues) => void;
};

export function ResumeUpload({
  hasUploadedResume,
  signedResumeUrl,
  onProfileExtracted,
}: Props): JSX.Element {
  const [isPending, startTransition] = useTransition();
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [resumeAvailable, setResumeAvailable] = useState(hasUploadedResume);
  const isBusy = isPending || isExtracting;

  const handleFile = (file: File): void => {
    if (isBusy) {
      return;
    }

    if (file.type !== "application/pdf") {
      setError("Only PDF files are supported");
      return;
    }
    if (file.size === 0) {
      setError("File is empty");
      return;
    }
    if (file.size > MAX_RESUME_SIZE_BYTES) {
      setError("File must be 5MB or smaller");
      return;
    }

    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await uploadResume(file);
      if (!result.success) {
        setError(result.error ?? "Failed to upload resume. Please try again.");
        return;
      }

      setResumeAvailable(true);
      setSuccess("Resume uploaded. You can now extract profile details.");
    });
  };

  const handleExtract = async (): Promise<void> => {
    setError(null);
    setSuccess(null);
    setIsExtracting(true);

    try {
      const response = await fetch("/api/resume/extract", { method: "POST" });
      const result = (await response.json()) as {
        profile?: ProfileFormValues;
        error?: string;
      };

      if (!response.ok || !result.profile) {
        setError(
          result.error ?? "Could not extract profile details. Please try again.",
        );
        return;
      }

      onProfileExtracted(result.profile);
      setSuccess(
        "Profile fields were filled from your resume. Review them before saving.",
      );
    } catch {
      setError("Could not extract profile details. Please try again.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }

    handleFile(file);
  };

  return (
    <section className="rounded-xl border border-border bg-surface p-6 shadow-lg">
      <h2 className="text-base font-semibold leading-6 text-text-primary">
        Resume
      </h2>
      <p className="mt-1 text-sm font-medium leading-5 text-text-secondary">
        Upload an existing resume to auto-fill the profile, or generate a new
        tailored one from your details below.
      </p>

      <label
        htmlFor="resume-upload"
        aria-disabled={isBusy}
        className={`mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-border-muted bg-surface-secondary px-6 py-12 text-center transition-colors ${
          isBusy
            ? "cursor-not-allowed opacity-60"
            : isDragging
              ? "cursor-pointer border-accent bg-surface-tertiary"
              : "cursor-pointer hover:bg-surface-tertiary"
        }`}
        onDragEnter={(event) => {
          event.preventDefault();
          if (!isBusy) {
            setIsDragging(true);
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          if (event.currentTarget === event.target) {
            setIsDragging(false);
          }
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          if (isBusy) {
            return;
          }

          const file = event.dataTransfer.files?.[0];
          if (file) {
            handleFile(file);
          }
        }}
      >
        <span className="flex size-10 items-center justify-center rounded-full border border-border bg-surface">
          <Upload className="size-5 text-accent" aria-hidden="true" />
        </span>
        <span className="mt-4 text-sm font-semibold leading-5 text-text-primary">
          {isPending ? "Uploading..." : "Click to upload or drag and drop"}
        </span>
        <span className="mt-1 text-xs font-normal leading-4 text-text-muted">
          PDF formatting only. Maximum file size 5MB.
        </span>
        <span className="mt-4 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium leading-5 text-text-primary">
          Select Resume
        </span>
        <input
          id="resume-upload"
          type="file"
          accept="application/pdf"
          className="hidden"
          disabled={isBusy}
          onChange={handleFileChange}
        />
      </label>

      {signedResumeUrl && resumeAvailable ? (
        <div className="mt-4 flex items-center gap-2 text-sm text-text-secondary">
          <FileText className="size-4" aria-hidden="true" />
          <a
            href={signedResumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            View current resume
          </a>
        </div>
      ) : null}

      {resumeAvailable ? (
        <div className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-6">
          <p className="text-sm font-medium leading-5 text-text-secondary">
            Fill blank profile fields using your uploaded resume.
          </p>
          <button
            type="button"
            disabled={isBusy}
            onClick={handleExtract}
            className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium leading-5 text-accent-foreground transition-colors hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Sparkles className="size-4" aria-hidden="true" />
            {isExtracting ? "Extracting..." : "Extract from Resume"}
          </button>
        </div>
      ) : null}

      {error ? (
        <p role="alert" className="mt-4 text-sm text-error">
          {error}
        </p>
      ) : null}

      {success ? (
        <p role="status" className="mt-4 text-sm text-success-foreground">
          {success}
        </p>
      ) : null}

      <div className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-6">
        <p className="text-sm font-medium leading-5 text-text-secondary">
          Need a fresh document based on the fields below?
        </p>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium leading-5 text-accent-foreground transition-colors hover:bg-accent-dark"
        >
          <FileText className="size-4" aria-hidden="true" />
          Generate Resume from Profile
        </button>
      </div>
    </section>
  );
}
