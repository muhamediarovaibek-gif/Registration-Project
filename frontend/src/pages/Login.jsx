import { useState } from "react";
import api from "../api/axios";
import { setToken } from "../utils/token";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/Reg.css";

export default function Login() {
  const [form, setForm] = useState({
    username: "",
    password: ""
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

    if (!form.username || !form.password) {
      toast.error("Заполните все поля");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("token/", {
        username: form.username,
        password: form.password
      });

      console.log("LOGIN SUCCESS");

      if (res.data?.access && res.data?.refresh) {
        setToken(res.data.access, res.data.refresh);
        toast.success("Вход выполнен успешно!");
        navigate("/profile");
      } else {
        toast.error("Сервер не вернул токен");
      }

    } catch (err) {
      console.log("LOGIN ERROR:", err);
      
      const status = err.response?.status;

      if (status === 401) {
        toast.error("Пользователь не найден или неверный пароль");
      } else if (status === 400) {
        toast.error("Некорректные данные");
      } else {
        toast.error("Ошибка входа");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="menu">
      <div className="auth-card">
        <h1 className="auth-title">Вход</h1>

        <form onSubmit={submit} className="auth-form">
          <input
            name="username"
            placeholder="Имя пользователя"
            value={form.username}
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

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>

        <p className="auth-footer-text">
          Нет аккаунта?{" "}
          <span className="auth-link" onClick={() => navigate("/register")}>
            Зарегистрироваться
          </span>
        </p>
      </div>
    </div>
  );
}
