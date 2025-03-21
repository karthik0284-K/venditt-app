import { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig"; // ✅ Ensure db is imported
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendEmailVerification, 
  onAuthStateChanged 
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Fix: Delay navigation after auth state change to prevent race conditions
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        setTimeout(() => navigate("/"), 500);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!name || !email || !password || !confirmPassword) {
      setError("⚠️ Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("⚠️ Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Save user details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        uid: user.uid,
      });

      // ✅ Send email verification
      await sendEmailVerification(user);
      setSuccessMessage("✅ Registration successful! Please check your email for verification.");
      setLoading(false);
    } catch (err) {
      setError(`⚠️ ${err.message.replace("Firebase:", "").trim()}`); // ✅ Clean up error messages
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email || !password) {
      setError("⚠️ Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        setError("⚠️ Email not verified. Please check your inbox.");
        setLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify(user));
      setSuccessMessage("✅ Successfully logged in! Redirecting...");
      setTimeout(() => navigate("/"), 1500);
      setLoading(false);
    } catch (err) {
      setError("⚠️ Invalid login credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {isSignUp ? (
          <>
            <h2>Create an Account</h2>
            {error && <p className="error">{error}</p>}
            {successMessage && <p className="success">{successMessage}</p>}
            <form onSubmit={handleSignUp}>
              <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              <button type="submit" disabled={loading}>{loading ? "Processing..." : "Sign Up"}</button>
              <p className="toggle-link" onClick={() => setIsSignUp(false)}>Already have an account? Login</p>
            </form>
          </>
        ) : (
          <>
            <h2>Welcome Back</h2>
            <p>Login to continue</p>
            {error && <p className="error">{error}</p>}
            {successMessage && <p className="success">{successMessage}</p>}
            <form onSubmit={handleLogin}>
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
              <p className="toggle-link" onClick={() => setIsSignUp(true)}>New user? Sign up</p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
