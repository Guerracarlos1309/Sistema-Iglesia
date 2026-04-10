import React, { useState, useEffect } from "react";
import {
  UserPlus,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  RotateCcw,
  Search,
  CheckCircle,
  XCircle,
  MoreVertical,
  User,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import {
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from "../../components/ui/Table";
import { Modal } from "../../components/ui/Modal";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { useToast } from "../../components/ui/Toast";
import { helpFetch, ENDPOINTS } from "../../utils/helpFetch";
import { cn } from "../../utils/cn";
import styles from "./Users.module.css";

export function Users() {
  const { addToast } = useToast();
  const { get, post, put, del } = helpFetch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isHardConfirmOpen, setIsHardConfirmOpen] = useState(false);
  const [userToArchive, setUserToArchive] = useState(null);
  const [userToHardDelete, setUserToHardDelete] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewDeleted, setViewDeleted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = `${ENDPOINTS.USERS.BASE}${viewDeleted ? "?deleted=true" : ""}`;
      const data = await get(endpoint);
      setUsers(data);
    } catch (err) {
      addToast("Error al cargar usuarios", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [viewDeleted]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación Frontend: Verificar duplicados en la lista local
    const emailExists = users.find(
      (u) => u.email.toLowerCase() === formData.email.toLowerCase(),
    );
    if (emailExists) {
      return addToast(
        "Este correo electrónico ya está en uso en el sistema",
        "error",
      );
    }

    if (formData.password.length < 8) {
      return addToast("La contraseña debe tener al menos 8 caracteres", "error");
    }

    try {
      // Registrar nuevo usuario vía Auth endpoint (para hashing de contraseña)
      await post(ENDPOINTS.AUTH.REGISTER, formData);
      addToast("Usuario creado correctamente");
      setIsModalOpen(false);
      setFormData({ name: "", email: "", password: "", role: "user" });
      fetchData();
    } catch (err) {
      console.error("Error creating user:", err);
      addToast(err.message || "Error al crear usuario", "error");
    }
  };

  const toggleStatus = async (user) => {
    try {
      await put(ENDPOINTS.USERS.ITEM(user.id), { active: !user.active });
      addToast(`Usuario ${user.active ? "desactivado" : "activado"}`);
      fetchData();
    } catch (err) {
      addToast("Error al cambiar estado", "error");
    }
  };

  const handleSoftDelete = (user) => {
    setUserToArchive(user);
    setIsConfirmOpen(true);
  };

  const confirmSoftDelete = async () => {
    if (!userToArchive) return;
    try {
      await del(ENDPOINTS.USERS.ITEM(userToArchive.id));
      addToast("Usuario archivado");
      setIsConfirmOpen(false);
      setUserToArchive(null);
      fetchData();
    } catch (err) {
      addToast("Error al archivar", "error");
    }
  };

  const handleRestore = async (id) => {
    try {
      await post(`${ENDPOINTS.USERS.ITEM(id)}/restore`);
      addToast("Usuario restaurado");
      fetchData();
    } catch (err) {
      addToast("Error al restaurar", "error");
    }
  };

  const handleHardDelete = (user) => {
    setUserToHardDelete(user);
    setIsHardConfirmOpen(true);
  };

  const confirmHardDelete = async () => {
    if (!userToHardDelete) return;
    try {
      await del(`${ENDPOINTS.USERS.ITEM(userToHardDelete.id)}?hard=true`);
      addToast("Usuario eliminado permanentemente");
      setIsHardConfirmOpen(false);
      setUserToHardDelete(null);
      fetchData();
    } catch (err) {
      addToast("Error al eliminar permanentemente", "error");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading && users.length === 0)
    return <div className="loading-spinner">Auditando acceso...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className="page-title">Gestión de Usuarios</h1>
          <p className="page-subtitle">
            Control de acceso y roles administrativos del sistema
          </p>
        </div>
        <div className={styles.actions}>
          <Button
            variant={viewDeleted ? "secondary" : "ghost"}
            onClick={() => setViewDeleted(!viewDeleted)}
          >
            {viewDeleted ? "Volver a Activos" : "Ver Archivados"}
          </Button>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <UserPlus size={18} /> Nuevo Usuario
          </Button>
        </div>
      </header>

      <div className={styles.filters}>
        <div className={styles.searchWrapper}>
          <Input
            icon={Search}
            placeholder="Buscar por nombre o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <TableContainer>
        <TableHead>
          <tr>
            <TableHeader>Usuario</TableHeader>
            <TableHeader>Rol</TableHeader>
            <TableHeader>Estado</TableHeader>
            <TableHeader>Fecha Registro</TableHeader>
            <TableHeader align="right">Acciones</TableHeader>
          </tr>
        </TableHead>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow
              key={user.id}
              className={user.deleted_at ? styles.deletedRow : ""}
            >
              <TableCell>
                <div className={styles.userInfo}>
                  <div className={styles.avatar}>
                    <User size={16} />
                  </div>
                  <div>
                    <div className={styles.userName}>{user.name}</div>
                    <div className={styles.userEmail}>{user.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span
                  className={cn(
                    styles.badge,
                    user.role === "admin" ? styles.admin : styles.user,
                  )}
                >
                  {user.role === "admin" ? (
                    <ShieldCheck size={14} />
                  ) : (
                    <Shield size={14} />
                  )}
                  {user.role === "admin" ? "Administrador" : "Líder / Usuario"}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={cn(
                    styles.statusBadge,
                    user.active ? styles.active : styles.inactive,
                  )}
                >
                  {user.active ? (
                    <CheckCircle size={14} />
                  ) : (
                    <XCircle size={14} />
                  )}
                  {user.active ? "Activo" : "Inactivo"}
                </span>
              </TableCell>
              <TableCell>
                {new Date(user.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell align="right">
                <div className={styles.rowActions}>
                  {!user.deleted_at ? (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleStatus(user)}
                        title={user.active ? "Desactivar" : "Activar"}
                      >
                        {user.active ? (
                          <XCircle size={18} />
                        ) : (
                          <CheckCircle size={18} />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSoftDelete(user)}
                        className={styles.deleteBtn}
                        title="Archivar"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRestore(user.id)}
                        className={styles.restoreBtn}
                        title="Restaurar"
                      >
                        <RotateCcw size={18} /> Restaurar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleHardDelete(user)}
                        className={styles.deleteBtn}
                        title="Eliminar Permanente"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableContainer>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registrar Nuevo Usuario"
      >
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Nombre Completo"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            label="Correo Electrónico"
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <Input
            label="Contraseña"
            type="password"
            required
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <div className={styles.formGroup}>
            <label className={styles.label}>Rol en el Sistema</label>
            <select
              className={styles.select}
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <option value="user">Líder (Acceso Limitado)</option>
              <option value="admin">Administrador (Control Total)</option>
            </select>
          </div>
          <div className={styles.modalActions}>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Crear Usuario
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmSoftDelete}
        title="Archivar Usuario"
        message={`¿Estás seguro de que deseas archivar a ${userToArchive?.name}? No podrá iniciar sesión hasta que sea restaurado.`}
        confirmText="Archivar Usuario"
      />

      <ConfirmModal
        isOpen={isHardConfirmOpen}
        onClose={() => setIsHardConfirmOpen(false)}
        onConfirm={confirmHardDelete}
        title="Eliminar Permanentemente"
        message={`¡ADVERTENCIA! ¿Estás seguro de eliminar a ${userToHardDelete?.name} de forma permanente? Esta acción no se puede deshacer y se borrarán todos sus registros.`}
        confirmText="ELIMINAR PARA SIEMPRE"
        isDanger={true}
      />
    </div>
  );
}
