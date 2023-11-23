import axios from "axios";
import { useEffect, useState } from "react";
import { signUp } from "./api";
import { Input } from "./components/input/components/input";

export function SignUp() {
  const [username, setUsername] = useState();
  const [email, setMail] = useState();
  const [password, setPassword] = useState();
  const [passwordRepeat, setPasswordRepeat] = useState();
  const [apiProgress, setApiProgress] = useState(false);
  const [successMessage, setSuccesssMessage] = useState();
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState();

  useEffect(() => {
    setErrors(function(lastErrors){ 
        return {
            ...lastErrors,
            // var olan error objesini kopyalayıp username i undefine ediyoruz. böylece diğer değerler değişmiyor.
            username: undefined
        }
    });
  }, [username]);

  useEffect(() => {
    setErrors(function(lastErrors){ 
        return {
            ...lastErrors,
            email: undefined
        }
    });
  }, [email]);
  // username de bir değişiklik oldugunda setErrors sıfırlıyor.

  useEffect(() => {
    setErrors(function(lastErrors){ 
        return {
            ...lastErrors,
            password: undefined
        }
    });
  }, [password]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setSuccesssMessage();
    setGeneralError();
    setApiProgress(true);

    try {
      const response = await signUp({
        username,
        email,
        password,
      });
      setSuccesssMessage(response.data.message);
    } catch (axiosError) {
      if (
        axiosError.response?.data &&
        axiosError.response.data.status === 400
      ) {
        setErrors(axiosError.response.data.validationErrors);
      } else {
        setGeneralError("Unexpected error occured. Please try again.");
      }
    } finally {
      setApiProgress(false);
    }
    //   .then((response) => {
    //     setSuccesssMessage(response.data.message);
    //   })
    //   .finally(() => setApiProgress(false));
  };

  return (
    <div className="container">
      <div className="col-lg-6 offset-lg-3 col-sm-8 offset-sm-2">
        <form className="card" onSubmit={onSubmit}>
          <div className="text-center card-header">
            <h1>Sign Up</h1>
          </div>
          <div className="card-body">
            <Input id="username" label="Username:" error={errors.username}
             onChange={(event) => setUsername(event.target.value)}/>

            <Input id="email" label="E-mail:" error={errors.email}
            onChange={(event) => setMail(event.target.value)}/>

            <Input type="password" id="password" label="Password:" error={errors.password}
            onChange={(event) => setPassword(event.target.value)}/>

             {/* <div className="mb-3">
              <label htmlFor="email" className="form-label">
                E-mail:
              </label>
              <input
                id="email"
                className= "form-control"
                onChange={(event) => setMail(event.target.value)}
              />
            </div>  */}
            {/* <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password:
              </label>
              <input
                id="password"
                className="form-control"
                type="password"
                onChange={(event) => setPassword(event.target.value)}
              />
            </div> */}
            <div className="mb-3">
              <label htmlFor="passwordRepeat" className="form-label">
                Password Repeat:
              </label>
              <input
                id="passwordRepeat"
                className="form-control"
                type="password"
                onChange={(event) => setPasswordRepeat(event.target.value)}
              />
            </div>
            {successMessage && (
              <div className="alert alert-success">{successMessage}</div>
            )}
            {generalError && (
              <div className="alert alert-danger">{generalError}</div>
            )}
            <div className="text-center">
              <button
                className="btn btn-primary"
                disabled={
                  apiProgress || !password || password !== passwordRepeat
                }
              >
                {apiProgress && (
                  <span
                    className="spinner-border spinner-border-sm"
                    aria-hidden="true"
                  ></span>
                )}
                Sign Up
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
