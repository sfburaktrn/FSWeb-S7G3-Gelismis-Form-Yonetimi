import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import axios from "axios";

const userSchema = Yup.object().shape({
  isim: Yup.string()
    .min(2, "Bu Kısa")
    .max(10, "Bu Uzun")
    .required("Gerekli Atlama"),
  email: Yup.string().email("Mail Yok").required("Gerekli Atlama"),

  sifre: Yup.string()
    .min(4, "Bu Kısa")
    .max(12, "Bu Uzun")
    .required("Gerekli Atlama"),
  sartlar: Yup.boolean().oneOf(
    [true],
    "Kullanım şartlarını ve gizlilik politikasını kabul etmeniz gerekmektedir."
  ),
});

export default function Form() {
  const [veri, setVeri] = useState({
    isim: "",
    email: "",
    sifre: "",
    sartlar: false,
  });

  const [disabledMi, setDisabledMi] = useState(true);
  const [errors, setErrors] = useState({
    isim: "",
    email: "",
    sifre: "",
    sartlar: "",
  });
  useEffect(() => {
    userSchema.isValid(veri).then((valid) => setDisabledMi(!valid));
  }, [veri]);

  const checkFormErrors = (name, value) => {
    Yup.reach(userSchema, name)
      .validate(value)
      .then(() => {
        setErrors({
          ...errors,
          [name]: "",
        });
      })
      .catch((err) => {
        setErrors({
          ...errors,
          [name]: err.errors[0],
        });
      });
  };

  function handleChange(e) {
    let valueTouse =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    checkFormErrors(e.target.name, valueTouse);
    setVeri({ ...veri, [e.target.name]: valueTouse });
    console.log(errors);
  }
  function handleSubmit(event) {
    event.preventDefault();
    console.log(veri);
    console.log("Submitted!");

    axios
      .post("https://reqres.in/api/users", veri)
      .then((response) => {
        console.log("başarili", response);
      })
      .catch((err) => console.log(err.response));
  }

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend>Member Add</legend>
            <p>
              <label htmlFor="Name">İsim-Soyad</label>
              <input
                id="Name"
                onChange={handleChange}
                value={veri.isim}
                name="isim"
                type="text"
              ></input>
            </p>
            {errors.isim !== "" && (
              <div
                id="KullanimSartlari"
                style={{ color: "purple", fontSize: 15 }}
              >
                {errors.isim}
              </div>
            )}
            <p>
              <label htmlFor="mail">Eposta Adresi</label>
              <input
                id="mail"
                onChange={handleChange}
                value={veri.eposta}
                name="email"
                type="text"
              ></input>
            </p>
            {errors.eposta !== "" && (
              <div
                id="KullanimSartlari"
                style={{ color: "purple", fontSize: 13 }}
              >
                {errors.eposta}
              </div>
            )}
            <p>
              <label htmlFor="Password">Şifre</label>
              <input
                id="Password"
                onChange={handleChange}
                value={veri.sifre}
                name="sifre"
                type="password"
              ></input>
            </p>
            {errors.sifre !== "" && (
              <div
                id="KullanimSartlari"
                style={{ color: "purple", fontSize: 13 }}
              >
                {errors.sifre}
              </div>
            )}
            <p>
              <label
                id="KullanimSartlari"
                htmlFor="KullanimSartlari"
                value={veri.sartlar}
              >
                Kullanım şartları ve gizlilik politikası*
              </label>
              {errors.sartlar !== "" && (
                <div
                  id="KullanimSartlari"
                  style={{ color: "purple", fontSize: 13 }}
                >
                  {errors.sartlar}
                </div>
              )}
              <input
                type="checkbox"
                onChange={handleChange}
                checked={veri.sartlar}
                name="sartlar"
                id="KullanimSartlari"
              ></input>
            </p>
            <p>
              <button type="submit" disabled={disabledMi}>
                Gönder
              </button>
            </p>
          </fieldset>
        </form>
      </div>
    </div>
  );
}
