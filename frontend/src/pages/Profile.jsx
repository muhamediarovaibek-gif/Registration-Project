import { useEffect, useState, useRef } from "react"; // Добавили useRef
import api from "../api/axios";
import { getToken, removeToken } from "../utils/token";
import { useNavigate } from "react-router-dom";
import "../styles/Reg.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Создали реф для скрытого инпута

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        if (!getToken()) {
          navigate("/login");
          return;
        }
        const res = await api.get("me/");
        setUser(res.data);
      } catch (err) {
        console.log(err);
        removeToken();
        navigate("/login");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const logout = () => {
    removeToken();
    navigate("/login");
  };

  // Автоматическая загрузка при выборе файла
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    try {
      const formData = new FormData();
      formData.append("avatar", selectedFile);

      const res = await api.patch("avatar/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUser((prev) => ({
        ...prev,
        avatar: res.data.avatar,
      }));
    } catch (err) {
      console.log("Ошибка загрузки аватарки:", err);
    }
  };

  // Функция, которая симулирует клик по скрытому инпуту
  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  if (loading) {
    return (
      <div className="menu">
        <div className="auth-card">
          <div className="loader">Загрузка профиля...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="menu">
        <div className="auth-card">
          <p className="error-text">Нет данных пользователя</p>
        </div>
      </div>
    );
  }

  return (
    <div className="menu">
      <div className="auth-card profile-card">
        
        {/* Кликабельный контейнер аватарки */}
        <div className="profile-avatar editable-avatar" onClick={triggerFileSelect} title="Изменить аватарку">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="avatar"
              className="avatar-image"
            />
          ) : (
            user.username ? user.username[0].toUpperCase() : "U"
          )}
          {/* Слой, который появляется при наведении */}
          <div className="avatar-overlay">
            <span>Изменить</span>
          </div>
        </div>

        {/* Полностью скрытый инпут для выбора файлов */}
        <input 
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }} 
        />

        <h1 className="profile-title">Личный кабинет</h1>

        {/* Блок с данными */}
        <div className="profile-info-box">
          <div className="info-row">
            <span className="info-label">Имя пользователя</span>
            <span className="info-value">{user.username}</span>
          </div>
          
          <div className="info-row">
            <span className="info-label">Электронная почта</span>
            <span className="info-value">{user.email}</span>
          </div>
        </div>

        {/* Кнопка выхода */}
        <button className="logout-btn" onClick={logout}>
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
}
