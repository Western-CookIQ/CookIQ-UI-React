import { TextField } from "@mui/material";
import PasswordValidator from "password-validator";
import React, { useState } from "react";

interface IPasswordField {
  name: string;
  placeholder: string;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
}

const PasswordField: React.FC<IPasswordField> = ({
  name,
  placeholder,
  password,
  setPassword,
}) => {
  const [passwordError, setPasswordError] = useState("");

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const validatePassword = (password: string) => {
    const schema = new PasswordValidator();

    // Define your password requirements
    schema
      .is()
      .min(8) // Minimum length 8
      .has()
      .uppercase() // Must have uppercase letters
      .has()
      .digits() // Must have digits
      .has()
      .symbols(); // Must have symbols

    const validationResult = schema.validate(password, {
      list: true,
    }) as string[];

    const errorTranslation: { [key: string]: string } = {
      min: "minimum length of 8 characters",
      uppercase: "one uppercase character",
      digits: "one number",
      symbols: "one special character",
    };

    if (validationResult.length > 0) {
      // If there are validation errors, set the error message
      let errorTranslationResult = validationResult.map(
        (error) => errorTranslation[error]
      );
      setPasswordError(
        `Password requirements: ${errorTranslationResult.join(", ")}.`
      );
    } else {
      // Clear the error message if the password is valid
      setPasswordError("");
    }
  };
  return (
    <TextField
      margin="normal"
      required
      fullWidth
      name={name}
      placeholder={placeholder}
      type="password"
      id={name}
      value={password}
      onChange={handlePasswordChange}
      error={!!password && !!passwordError}
      helperText={password ? passwordError : ""}
    />
  );
};

export default PasswordField;
