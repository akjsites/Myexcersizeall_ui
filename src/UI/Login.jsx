import { useState } from "react";
import { LoginData } from "../FileApiSystem/api";
import { useNavigate } from "react-router-dom";

export function FileSystemApp() {
  const [UserName, setUserName] = useState("");
  const [Password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!UserName.trim() || !Password.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const data = await LoginData(UserName, Password);
      if (data.status === 200) {
        alert("Login successful");
        navigate("/dashboard");
      } else {
        alert("Login failed: " + (data.message || "Invalid credentials"));
      }
    } catch (error) {
      console.error(error);
      alert("Login error: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
              'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
              sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
          }

          .login-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
            width: 100%;
          }

          .login-card {
            background: #fff;
            padding: clamp(30px, 5vw, 50px) clamp(20px, 4vw, 40px);
            border-radius: 16px;
            box-shadow: 
              0 10px 40px rgba(0, 0, 0, 0.08),
              0 2px 8px rgba(0, 0, 0, 0.06);
            width: 100%;
            max-width: min(95vw, 420px);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }

          .login-card:hover {
            transform: translateY(-2px);
            box-shadow: 
              0 12px 50px rgba(0, 0, 0, 0.12),
              0 4px 12px rgba(0, 0, 0, 0.08);
          }

          .login-header {
            text-align: center;
            margin-bottom: 35px;
          }

          .login-header h2 {
            color: #2c3e50;
            font-size: clamp(24px, 4vw, 28px);
            margin-bottom: 8px;
            font-weight: 600;
          }

          .login-header p {
            color: #7f8c8d;
            font-size: 14px;
          }

          .login-form {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }

          .form-group {
            position: relative;
          }

          .form-group input {
            width: 100%;
            padding: 16px 20px;
            padding-left: 48px;
            border: 2px solid #e8ecf1;
            border-radius: 12px;
            font-size: 15px;
            color: #333;
            background: #f8f9fa;
            transition: all 0.3s ease;
            outline: none;
          }

          .form-group input:focus {
            border-color: #007bff;
            background: #fff;
            box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
          }

          .form-group input::placeholder {
            color: #a0aec0;
          }

          .form-icon {
            position: absolute;
            left: 16px;
            top: 50%;
            transform: translateY(-50%);
            color: #a0aec0;
            font-size: 18px;
          }

          .login-button {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
            margin-top: 10px;
          }

          .login-button:hover:not(:disabled) {
            background: linear-gradient(135deg, #0056b3 0%, #004494 100%);
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(0, 123, 255, 0.25);
          }

          .login-button:active:not(:disabled) {
            transform: translateY(0);
          }

          .login-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .spinner {
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          .login-footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e8ecf1;
            color: #7f8c8d;
            font-size: 14px;
          }

          .signup-link {
            color: #007bff;
            text-decoration: none;
            font-weight: 600;
            margin-left: 5px;
            transition: color 0.2s;
          }

          .signup-link:hover {
            color: #0056b3;
            text-decoration: underline;
          }

          /* Responsive adjustments */
          @media (max-width: 480px) {
            .login-container {
              padding: 15px;
            }
            
            .login-card {
              padding: 25px 20px;
              border-radius: 12px;
            }

            .form-group input {
              padding: 14px 16px;
              padding-left: 44px;
              font-size: 14px;
            }

            .login-button {
              padding: 14px;
              font-size: 15px;
            }

            .login-header {
              margin-bottom: 25px;
            }
          }

          @media (max-width: 350px) {
            .login-card {
              padding: 20px 15px;
            }
            
            .form-group input {
              padding: 12px 14px;
              padding-left: 40px;
            }

            .login-button {
              padding: 12px;
            }
          }

          /* Dark mode support */
          @media (prefers-color-scheme: dark) {
            body {
              background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
            }

            .login-card {
              background: #2d3748;
              color: #e2e8f0;
            }

            .login-header h2 {
              color: #e2e8f0;
            }

            .login-header p {
              color: #a0aec0;
            }

            .form-group input {
              background: #4a5568;
              border-color: #4a5568;
              color: #e2e8f0;
            }

            .form-group input:focus {
              background: #4a5568;
              border-color: #4299e1;
            }

            .form-icon {
              color: #a0aec0;
            }

            .login-footer {
              border-top-color: #4a5568;
              color: #a0aec0;
            }
          }
        `}
      </style>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Please enter your credentials to continue</p>
          </div>
          
          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <span className="form-icon">👤</span>
              <input
                type="text"
                placeholder="Username"
                value={UserName}
                onChange={(e) => setUserName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <span className="form-icon">🔒</span>
              <input
                type="password"
                placeholder="Password"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            <button 
              type="submit" 
              className="login-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>
          
          <div className="login-footer">
            Don't have an account?
            <a href="#" className="signup-link">Sign up</a>
          </div>
        </div>
      </div>
      
    </>
  );
}