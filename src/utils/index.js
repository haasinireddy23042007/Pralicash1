function formatINR(n) {
  return "₹" + Number(n).toLocaleString("en-IN");
}
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371, dLat = (lat2 - lat1) * Math.PI / 180, dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function maskEmail(email) {
  const [a, b] = email.split("@");
  return a[0] + "****" + a[a.length - 1] + "@" + b;
}

const sendOtpEmail = async (email, otp) => {
  try {
    const res = await fetch("/api/resend/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer re_UrYSgbEu_9fKRXuJBPyfxajFcNGeNqJ83",
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: [email],
        subject: "PraliCash Login OTP",
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px;">
            <h2 style="color: #d97706;">PraliCash</h2>
            <p>Your one-time password (OTP) for PraliCash login is:</p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1e293b; background: #f8fafc; padding: 12px 24px; border-radius: 8px; border: 1px dashed #cbd5e1;">${otp}</span>
            </div>
            <p style="color: #64748b; font-size: 12px;">This code will expire in 5 minutes. If you did not request this, please ignore this email.</p>
          </div>
        `,
      }),
    });
    const resData = await res.json();
    if (!res.ok) {
      console.error("Resend OTP Error:", resData);
      alert(`OTP delivery failed: ${resData.message || "Unknown error"}`);
    }
    return resData;
  } catch (err) {
    console.error("Network Error:", err);
    return { error: err.message };
  }
};

const sendResetEmail = async (email, username) => {
  try {
    const res = await fetch("/api/resend/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer re_UrYSgbEu_9fKRXuJBPyfxajFcNGeNqJ83",
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: [email],
        subject: "PraliCash Password Reset Request",
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 16px;">
            <h2 style="color: #059669;">PraliCash</h2>
            <p>Hello <strong>${username}</strong>,</p>
            <p>We noticed a login attempt with an incorrect password for your account.</p>
            <p>If you've forgotten your password, you can reset it by clicking the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:5173/?reset=${username}" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a>
            </div>
            <p style="color: #64748b; font-size: 12px;">If you did not request this, please ignore this email.</p>
          </div>
        `,
      }),
    });
    const resData = await res.json();
    if (!res.ok) {
      console.error("Resend API Error:", resData);
      alert(`Email failed: ${resData.message || "Unknown error"}`);
    }
    return resData;
  } catch (err) {
    console.error("Network Error:", err);
    alert("Network error while sending email. Check if dev server is running.");
    return { error: err.message };
  }
};


export { formatINR, haversine, maskEmail, sendOtpEmail, sendResetEmail };
