import { useState, useEffect } from "react";
import { PeopleOutline } from "@mui/icons-material";
import useSWR from "swr";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Grid, Select, MenuItem } from "@mui/material";

import { AdminLayout } from "../../components/layouts";
import { IUser } from "../../interfaces";
import { tesloApi } from "../../api";

const UsersPage = () => {
  const { data, error } = useSWR<IUser[]>("/api/admin/users");
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data]);

  if (!data && !error) return <></>;

  const onRoleUpdate = async (userId: string, newRole: string) => {
    const previusUsers = users.map((user) => ({ ...user }));

    const updateUsers = users.map((user) => ({
      ...user,
      role: userId === user._id ? newRole : user.role,
    }));

    setUsers(updateUsers);
    try {
      await tesloApi.put(`/admin/users/`, { userId, role: newRole });
    } catch (error) {
      setUsers(previusUsers);
      console.log(error);
      alert("Error al actualizar el rol del usuario");
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 300 },
    {
      field: "email",
      headerName: "Correo",
      width: 300,
      editable: false,
    },
    {
      field: "name",
      headerName: "Nombre",
      width: 300,
      editable: true,
    },
    {
      field: "role",
      headerName: "Rol",
      width: 300,
      renderCell: ({ row }) => {
        return (
          <Select
            value={row.role}
            label="Rol"
            sx={{ width: "300px" }}
            onChange={({ target }) => onRoleUpdate(row.id, target.value)}
          >
            <MenuItem value="admin"> Admin </MenuItem>
            <MenuItem value="client"> Client </MenuItem>
            <MenuItem value="super-user"> Super User </MenuItem>
            <MenuItem value="SEO"> SEO </MenuItem>
          </Select>
        );
      },
    },
  ];

  const rows = users.map((user) => ({
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
  }));

  return (
    <AdminLayout
      title={"Usuarios"}
      subTitle={"Mantenimiento de usuarios"}
      icon={<PeopleOutline />}
    >
      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default UsersPage;
