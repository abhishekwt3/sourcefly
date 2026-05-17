"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase-client";
import { COLORS } from "@/lib/theme";

const DIAL_CODE = "+91";

export default function PhoneAuthFlow({ next }) {
  const router = useRouter();
  const [stage, setStage] = useState("phone"); // phone | otp
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [resendIn, setResendIn] = useState(0);
  const recaptchaRef = useRef(null);

  // Tick the resend countdown
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setInterval(() => setResendIn((x) => Math.max(0, x - 1)), 1000);
    return () => clearInterval(t);
  }, [resendIn]);

  const sendOtp = async () => {
    setError(null);
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) {
      setError("Enter a 10-digit mobile number");
      return;
    }
    setBusy(true);
    try {
      // Always clear and recreate — reCAPTCHA token is single-use
      if (recaptchaRef.current) {
        try { recaptchaRef.current.clear(); } catch (_) {}
        recaptchaRef.current = null;
      }
      recaptchaRef.current = new RecaptchaVerifier(firebaseAuth, "recaptcha-container", {
        size: "invisible",
      });
      const result = await signInWithPhoneNumber(
        firebaseAuth,
        `${DIAL_CODE}${digits}`,
        recaptchaRef.current
      );
      setConfirmation(result);
      setStage("otp");
      setResendIn(30);
    } catch (e) {
      setError(e?.message || "Could not send OTP. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const verifyOtp = async (code) => {
    setError(null);
    if (!confirmation) {
      setError("Session expired. Send OTP again.");
      return;
    }
    if (code.length !== 6) return;
    setBusy(true);
    try {
      const cred = await confirmation.confirm(code);
      const idToken = await cred.user.getIdToken();
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Verification failed");
      const dest = data.next === "/" ? next || "/" : data.next;
      router.replace(dest);
    } catch (e) {
      setError(e?.message || "Invalid OTP");
    } finally {
      setBusy(false);
    }
  };

  if (stage === "phone") {
    return (
      <div className="px-5 pt-14 pb-8">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
          style={{ background: COLORS.amber }}
        >
          <span className="pf font-bold text-lg" style={{ color: COLORS.onAccent }}>
            K
          </span>
        </div>
        <h1 className="pf text-2xl font-bold mb-1" style={{ color: COLORS.text }}>
          Sign in to Kendra
        </h1>
        <p className="text-sm mb-8" style={{ color: COLORS.muted }}>
          Verified D2C suppliers. No spam, no cold calls.
        </p>

        <label
          className="text-xs font-medium block mb-2 uppercase tracking-widest"
          style={{ color: COLORS.muted }}
        >
          Mobile number
        </label>
        <div
          className="flex items-center rounded-xl px-3 py-3 mb-2"
          style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}
        >
          <span className="text-sm font-medium pr-3 mr-3" style={{ color: COLORS.text, borderRight: `1px solid ${COLORS.border}` }}>
            🇮🇳 {DIAL_CODE}
          </span>
          <input
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
            className="flex-1 bg-transparent text-base focus:outline-none"
            style={{ color: COLORS.text }}
          />
        </div>
        {error && (
          <p className="text-xs mt-1 mb-2" style={{ color: "#C0392B" }}>
            {error}
          </p>
        )}
        <p className="text-xs mb-6" style={{ color: COLORS.muted }}>
          We'll send a 6-digit OTP via SMS. By continuing you agree to the terms.
        </p>

        <button
          onClick={sendOtp}
          disabled={busy || phone.length !== 10}
          className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all"
          style={{
            background: phone.length === 10 ? COLORS.amber : COLORS.surface2,
            color: phone.length === 10 ? COLORS.onAccent : COLORS.muted,
            cursor: busy ? "wait" : phone.length === 10 ? "pointer" : "not-allowed",
          }}
        >
          {busy ? "Sending…" : "Send OTP"}
        </button>

        <div id="recaptcha-container" />
      </div>
    );
  }

  return (
    <div className="px-5 pt-14 pb-8">
      <button
        onClick={() => {
          setStage("phone");
          setOtp("");
          setConfirmation(null);
        }}
        className="text-xs mb-6 underline"
        style={{ color: COLORS.muted }}
      >
        ← Change number
      </button>
      <h1 className="pf text-2xl font-bold mb-1" style={{ color: COLORS.text }}>
        Enter OTP
      </h1>
      <p className="text-sm mb-8" style={{ color: COLORS.muted }}>
        Sent to {DIAL_CODE} {phone}
      </p>

      <input
        inputMode="numeric"
        autoComplete="one-time-code"
        autoFocus
        placeholder="••••••"
        value={otp}
        onChange={(e) => {
          const v = e.target.value.replace(/\D/g, "").slice(0, 6);
          setOtp(v);
          if (v.length === 6) verifyOtp(v);
        }}
        className="w-full rounded-xl px-4 py-4 text-xl tracking-[0.6em] text-center focus:outline-none"
        style={{
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          color: COLORS.text,
          letterSpacing: "0.6em",
        }}
      />
      {error && (
        <p className="text-xs mt-2" style={{ color: "#C0392B" }}>
          {error}
        </p>
      )}

      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => verifyOtp(otp)}
          disabled={busy || otp.length !== 6}
          className="px-5 py-2.5 rounded-xl font-semibold text-sm"
          style={{
            background: otp.length === 6 ? COLORS.amber : COLORS.surface2,
            color: otp.length === 6 ? COLORS.onAccent : COLORS.muted,
          }}
        >
          {busy ? "Verifying…" : "Verify"}
        </button>
        <button
          onClick={sendOtp}
          disabled={resendIn > 0 || busy}
          className="text-xs"
          style={{
            color: resendIn > 0 ? COLORS.muted : COLORS.amber,
            textDecoration: resendIn > 0 ? "none" : "underline",
          }}
        >
          {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend OTP"}
        </button>
      </div>
    </div>
  );
}
