import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setToken } from "../utils/token";
import "../styles/Reg.css";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Пароли не совпадают");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("register/", {
        username: form.username,
        email: form.email,
        password: form.password
      });

      console.log("REGISTER RESPONSE:", res.data);

      if (res.data?.access && res.data?.refresh) {
        setToken(res.data.access, res.data.refresh);
        toast.success("Регистрация прошла успешно!");
        navigate("/profile");
      } else {
        toast.error("Нет токена от сервера");
        navigate("/login");
      }

    } catch (err) {
      console.log("Ошибка регистрации:", err);
      toast.error("Ошибка сервера");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="menu">
      <div className="auth-card">
        <h1 className="auth-title">Регистрация</h1>

        <form onSubmit={submit} className="auth-form">
          <input
            name="username"
            placeholder="Имя пользователя"
            value={form.username}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Пароль"
            value={form.password}
            onChange={handleChange}
            required
          />

          <input
            name="confirmPassword"
            type="password"
            placeholder="Подтвердите пароль"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Регистрация..." : "Зарегистрироваться"}
          </button>
        </form>

        <p className="auth-footer-text">
          Уже есть аккаунт?{" "}
          <span className="auth-link" onClick={() => navigate("/login")}>
            Войти
          </span>
        </p>
      </div>
    </div>
  );
}
