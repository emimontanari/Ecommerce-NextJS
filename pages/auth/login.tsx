import { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { signIn, getSession, getProviders } from "next-auth/react";
import { useForm } from "react-hook-form";
import NextLink from "next/link";
import { ErrorOutline } from "@mui/icons-material";
import GitHubIcon from "@mui/icons-material/GitHub";
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { AuthLayout } from "../../components/layouts";
import { validations } from "../../utils";

type FormData = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [showError, setShowError] = useState(false);
  const [providers, setProviders] = useState<any>({});
  const router = useRouter();

  useEffect(() => {
    getProviders().then((prov) => {
      setProviders(prov);
    });
  }, []);

  const onLoginUser = async ({ email, password }: FormData) => {
    setShowError(false);

    // const isValidLogin = await loginUser(email, password);

    // if (!isValidLogin) {
    //   setShowError(true);
    //   setTimeout(() => {
    //     setShowError(false);
    //   }, 3000);
    //   return;
    // }

    // const destination = router.query.p?.toString() || "/";

    // router.replace(destination);

    await signIn("credentials", {
      email,
      password,
    });
  };

  return (
    <AuthLayout title={"Ingresar"}>
      <form onSubmit={handleSubmit(onLoginUser)}>
        <Box sx={{ width: 350, padding: "10px 20px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1">
                Iniciar Sesión
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
                label="Contraseña"
                type="password"
                variant="filled"
                fullWidth
                {...register("password", {
                  required: "La contraseña es requerida",
                  minLength: {
                    value: 6,
                    message: "La contraseña debe tener al menos 6 caracteres",
                  },
                })}
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
              <NextLink
                href={
                  router.query.p
                    ? `/auth/register?p=${router.query.p} `
                    : "/auth/register"
                }
                passHref
              >
                ¿No tienes cuenta?
              </NextLink>
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="center">
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Divider sx={{ width: "100%", mb: 2 }} />
                {Object.values(providers)
                  .filter((provider: any) => provider.id !== "credentials")
                  .map((provider: any) => {
                    return (
                      <Button
                        key={provider.id}
                        variant="outlined"
                        fullWidth
                        color="primary"
                        sx={{ mb: 1, border: "1px solid #ccc" }}
                        onClick={() => signIn(provider.id)}
                        startIcon={<GitHubIcon />}
                      >
                        {provider.name}
                      </Button>
                    );
                  })}
              </div>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const session = await getSession({ req });

  const { p = "/" } = query;

  if (session) {
    return {
      redirect: {
        destination: p.toString(),
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
export default LoginPage;
