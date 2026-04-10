import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Church, Mail, Lock, ArrowRight, Key, CheckCircle } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { useToast } from "../../components/ui/Toast";
import { useAuth } from "../../context/AuthContext";
import styles from "./Login.module.css";

export function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [isSubmittingReset, setIsSubmittingReset] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { addToast } = useToast();

  const { login, user, loading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Credenciales incorrectas");
      }

      login(data);
      navigate("/");
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingReset(true);

    try {
      // API call to /api/auth/forgot-password
      const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();
      setSuccessMessage(data.message || "Instrucciones enviadas.");
      setResetSuccess(true);
      setForgotEmail("");
    } catch (error) {
      addToast(
        "Error al procesar la solicitud. Por favor intenta de nuevo.",
        "error",
      );
    } finally {
      setIsSubmittingReset(false);
    }
  };

  const closeForgotModal = () => {
    setIsModalOpen(false);
    // Reset success state after modal closes so it's ready for next time
    setTimeout(() => {
      setResetSuccess(false);
      setSuccessMessage("");
    }, 300);
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.ambientLight1}></div>
      <div className={styles.ambientLight2}></div>

      <div className={styles.leftPanel}>
        <div className={styles.brandInfo}>
          <div className={styles.logo}>
            <div
              style={{
                background: "var(--bg-tertiary)",
                padding: "12px",
                borderRadius: "12px",
              }}
            >
              <Church size={32} />
            </div>
            <span className={styles.logoText}>ChurchConnect</span>
          </div>
          <h1 className={styles.welcomeTitle}>
            Gestiona tu congregación con excelencia.
          </h1>
          <p className={styles.welcomeText}>
            Una plataforma moderna, rápida y segura diseñada específicamente
            para el manejo integral de las áreas de tu iglesia.
          </p>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.loginCard}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Iniciar Sesión</h2>
            <p className={styles.formSubtitle}>
              Ingresa tus credenciales para continuar
            </p>
          </div>

          <form
            className={styles.loginForm}
            onSubmit={handleSubmit}
            style={{ marginBottom: "1rem" }}
          >
            <div className={styles.inputGroup}>
              <label className={styles.label}>Correo Electrónico</label>
              <Input
                type="email"
                name="email"
                placeholder="usuario@iglesia.com"
                icon={Mail}
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className={styles.inputGroup} style={{ marginBottom: "1rem" }}>
              <label className={styles.label} style={{ marginTop: "0.5rem" }}>
                Contraseña
              </label>
              <Input
                type="password"
                name="password"
                placeholder="••••••••"
                icon={Lock}
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button
              type="button"
              className={styles.forgotPassword}
              onClick={() => {
                setResetSuccess(false);
                setIsModalOpen(true);
              }}
            >
              ¿Olvidaste tu contraseña?
            </button>

            <Button
              type="submit"
              variant="primary"
              className={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? "Autenticando..." : "Entrar al Sistema"}
              {!isLoading && (
                <ArrowRight size={18} style={{ marginLeft: "8px" }} />
              )}
            </Button>
          </form>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeForgotModal}
        title={resetSuccess ? "¡Solicitud Enviada!" : "Recuperar Contraseña"}
      >
        {!resetSuccess ? (
          <form onSubmit={handleResetSubmit} className={styles.loginForm}>
            <div className={styles.modalIconContainer}>
              <div className={styles.modalIcon}>
                <Key size={32} />
              </div>
            </div>

            <p
              className={styles.formSubtitle}
              style={{ textAlign: "center", marginBottom: "1.5rem" }}
            >
              Ingresa tu correo electrónico y te enviaremos las instrucciones
              para restaurar tu contraseña.
            </p>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Correo Electrónico</label>
              <Input
                type="email"
                placeholder="tu-correo@iglesia.com"
                icon={Mail}
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className={styles.submitBtn}
              disabled={isSubmittingReset}
              style={{ marginTop: "1rem" }}
            >
              {isSubmittingReset ? "Enviando..." : "Enviar Instrucciones"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={closeForgotModal}
              style={{ marginTop: "1.0rem" }}
            >
              Cancelar
            </Button>
          </form>
        ) : (
          <div className={styles.successState}>
            <div className={styles.successIcon}>
              <CheckCircle size={64} />
            </div>
            <h3 className={styles.successTitle}>¡Revisa tu correo!</h3>
            <p className={styles.successDescription}>{successMessage}</p>
            <Button
              variant="primary"
              onClick={closeForgotModal}
              className={styles.submitBtn}
            >
              Entendido
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
