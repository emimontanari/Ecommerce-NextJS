import { useContext, useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import { getSession, signIn } from "next-auth/react";

import NextLink from "next/link";
import { Box, Button, Chip, Grid, Link, TextField, Typography } from "@mui/material";
import { AuthLayout } from "../../components/layouts";
import { useForm } from "react-hook-form";
import { validations } from "../../utils";
import { ErrorOutline } from "@mui/icons-material";
import { useRouter } from "next/router";
import { AuthContext } from "../../context";

type FormData = {
  name: string;
  email: string;
  password: string;
};

const RegisterPage: NextPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();
  const {registerUser} = useContext(AuthContext);

  const onRegisterForm = async ({ name, email, password }: FormData) => {
    setShowError(false);

    const {hasError, message} = await registerUser(name, email, password);

    if (hasError) {
      setShowError(true);
      setErrorMessage(message!);
      setTimeout(() => {
        setShowError(false);
      }
      , 3000);
      return;
    }

    // const destination = router.query.p?.toString() || "/";

    // router.replace(destination);

    await signIn("credentials", { email, password });
  };

  return (
    <AuthLayout title={"Ingresar"}>
      <form onSubmit={handleSubmit(onRegisterForm)}>
        <Box sx={{ width: 350, padding: "10px 20px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1">
                Crear cuenta
              </Typography>
            <Chip
                label="No reconocemos ese usuario/contraseña"
                color="error"
                icon={<ErrorOutline />}
                className="fadeIn"
                sx={{ display: showError ? "flex" : "none" }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("name", {
                  required: "El nombre es Requerido",
                  minLength: {
                    value: 2,
                    message: "El Nombre debe tener al menos 2 caracteres",
                  },
                })}
                label="Nombre completo"
                variant="filled"
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="email"
                {...register("email", {
                  required: "El correo es requerido",
                  validate: validations.isEmail,
                })}
                label="Correo"
                variant="filled"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("password", {
                  required: "La contraseña es requerida",
                  minLength: {
                    value: 6,
                    message: "La contraseña debe tener al menos 6 caracteres",
                  },
                })}
                label="Contraseña"
                type="password"
                variant="filled"
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                color="secondary"
                className="circular-btn"
                size="large"
                fullWidth
              >
                Ingresar
              </Button>
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="end">
              <NextLink  href={router.query.p ? `/auth/login?p=${router.query.p} `: "/auth/login"} passHref>
                ¿Ya tienes cuenta?
              </NextLink>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
};


export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
  const session = await getSession({req});

  const {p = "/" } = query;



  if(session) {
    return{
      redirect: {
        destination:p.toString(),
        permanent: false
    }
    }
  }

  return {
    props: {}
  }
}
export default RegisterPage;
