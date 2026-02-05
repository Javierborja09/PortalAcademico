import React from "react";
import {
  Pencil,
  Mail,
  ShieldCheck,
  GraduationCap,
  UserCog,
  Hash,
} from "lucide-react";
import Avatar from "@/components/common/Avatar";
const UsuarioItem = ({ usuario, onEdit }) => {
  if (!usuario) return null;
  // CONFIGURACIÓN DE ROLES
  const getRoleConfig = (rol) => {
    const lowerRol = rol?.toLowerCase() || "";
    const configs = {
      admin: {
        style: "bg-purple-50 text-purple-600 border-purple-100",
        icon: <ShieldCheck size={12} className="mr-1.5" />,
      },
      docente: {
        style: "bg-amber-50 text-amber-600 border-amber-100",
        icon: <UserCog size={12} className="mr-1.5" />,
      },
      alumno: {
        style: "bg-blue-50 text-blue-600 border-blue-100",
        icon: <GraduationCap size={12} className="mr-1.5" />,
      },
    };
    return (
      configs[lowerRol] || {
        style: "bg-gray-50 text-gray-600 border-gray-100",
        icon: null,
      }
    );
  };

  const roleConfig = getRoleConfig(usuario.rol);

  return (
    <tr className="flex flex-col md:table-row border-b border-slate-50 last:border-0 hover:bg-slate-50/80 transition-all duration-300 group p-4 md:p-0">
      {/* IDENTIDAD */}
      <td className="md:p-5 pb-3">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar
              src={usuario.foto_perfil}
              type="perfil"
              className="w-12 h-12 md:w-11 md:h-11 rounded-full group-hover:scale-105"
              alt="Avatar"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <p className="text-sm font-black text-slate-800 leading-tight">
              {usuario.nombre} {usuario.apellido}
            </p>
            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
              <Hash size={10} />
              <span>{usuario.id_usuario || "ID"}</span>
            </div>
          </div>
        </div>
      </td>

      {/* CORREO */}
      <td className="md:p-5 py-2 hidden sm:table-cell">
        <div className="flex items-center gap-2 text-sm text-slate-600 font-medium italic">
          <Mail size={14} className="text-slate-300" />
          <span className="truncate max-w-[150px] lg:max-w-none">
            {usuario.correo || "sin correo"}
          </span>
        </div>
      </td>

      {/* ROL */}
      <td className="md:p-5 py-2">
        <span
          className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.1em] border transition-all ${roleConfig.style}`}
        >
          {roleConfig.icon}
          {usuario.rol || "Sin Rol"}
        </span>
      </td>

      {/* ACCIONES */}
      <td className="md:p-5 pt-4 md:text-right">
        <div className="flex md:justify-end md:opacity-0 group-hover:opacity-100 transition-all">
          <button
            onClick={() => onEdit?.(usuario)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 md:p-2.5 p-3 bg-white hover:bg-blue-600 text-slate-400 hover:text-white rounded-xl border border-slate-100 md:border-transparent hover:border-blue-600 transition-all shadow-sm md:shadow-none active:scale-95 group/btn"
            title="Editar Registro"
          >
            <Pencil
              size={16}
              strokeWidth={2.5}
              className="group-hover/btn:rotate-12 transition-transform"
            />
            <span className="md:hidden text-[10px] font-black uppercase ml-2">
              Editar Usuario
            </span>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default UsuarioItem;
