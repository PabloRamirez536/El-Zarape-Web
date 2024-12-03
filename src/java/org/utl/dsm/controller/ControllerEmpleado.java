/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package org.utl.dsm.controller;

import com.mysql.cj.jdbc.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import org.utl.dsm.bd.ConexionMysql;
import org.utl.dsm.model.Ciudad;
import org.utl.dsm.model.Sucursal;
import org.utl.dsm.model.Empleado;
import org.utl.dsm.model.Estado;
import org.utl.dsm.model.Persona;
import org.utl.dsm.model.Usuario;

/**
 *
 * @author ramir
 */
public class ControllerEmpleado {
    
    public List<Empleado> getAllEmpleados() throws SQLException {
        String sql = "SELECT * FROM vista_empleados_detallada;";
        ConexionMysql connMysql = new ConexionMysql();
        Connection conn = connMysql.open();
        PreparedStatement pstmt = conn.prepareStatement(sql);
        ResultSet rs = pstmt.executeQuery();
        List<Empleado> listaEmpleados = new ArrayList<>();

        while (rs.next()) {
            listaEmpleados.add(fill(rs)); // Llama al método `fill` para mapear los datos
        }

        rs.close();
        pstmt.close();
        connMysql.close();

        return listaEmpleados;
    }

    public Empleado fill(ResultSet rs) throws SQLException {
        Persona persona = new Persona();
        persona.setIdPersona(rs.getInt("idPersona"));  // Asegúrate de asignar el ID
        persona.setNombre(rs.getString("Nombre"));
        persona.setApellidos(rs.getString("Apellidos"));
        persona.setTelefono(rs.getString("Teléfono"));

        Usuario usuario = new Usuario();
        usuario.setIdUsuario(rs.getInt("idUsuario"));  // Asegúrate de asignar el ID
        usuario.setNombre(rs.getString("Usuario"));
        usuario.setContrasenia(rs.getString("Contraseña"));

        Ciudad ciudad = new Ciudad();
        ciudad.setIdCiudad(rs.getInt("idCiudad"));  // Asignar ID de Ciudad
        ciudad.setNombre(rs.getString("Ciudad"));

        Estado estado = new Estado();  // Agregar objeto Estado
        estado.setIdEstado(rs.getInt("idEstado"));  // Asignar ID de Estado
        estado.setNombre(rs.getString("Estado"));  // Asignar el nombre del Estado
        
        Sucursal sucursal = new Sucursal();
        sucursal.setIdSucursal(rs.getInt("idSucursal"));
        sucursal.setNombre(rs.getString("Sucursal"));
        

        Empleado empleado = new Empleado();
        empleado.setIdEmpleado(rs.getInt("ID Empleado"));
        empleado.setActivo(rs.getString("Estatus").equals("Activo"));
        empleado.setPersona(persona);
        empleado.setUsuario(usuario);
        empleado.setCiudad(ciudad);
        empleado.setEstado(estado);
        empleado.setSucursal(sucursal);

        return empleado; // Devuelve el objeto Cliente completamente mapeado
    }

    public Empleado insertarEmpleado(Empleado empleado) throws SQLException {
        String query = "{CALL sp_insertEmpleado(?, ?, ?, ?, ?, ?, ?)}";
        boolean resultado = false;

        try {
            ConexionMysql connMysql = new ConexionMysql();
            Connection conn = connMysql.open();
            CallableStatement pstm = (CallableStatement) conn.prepareCall(query);

            pstm.setString(1, empleado.getPersona().getNombre());
            pstm.setString(2, empleado.getPersona().getApellidos());
            pstm.setString(3, empleado.getPersona().getTelefono());
            pstm.setString(4, empleado.getUsuario().getNombre());
            pstm.setString(5, empleado.getUsuario().getContrasenia());
            pstm.setInt(6, empleado.getCiudad().getIdCiudad());
            pstm.setInt(7, empleado.getSucursal().getIdSucursal());

            pstm.execute();
            pstm.close();
            connMysql.close();

        } catch (SQLException e) {
            e.getStackTrace();
        }
        return empleado;
    }

    public Empleado actualizarEmpleado(Empleado empleado) throws SQLException {
        String query = "{CALL sp_updateEmpleado(?, ?, ?, ?, ?, ?, ?, ?, ?)}";

        try {
            ConexionMysql connMysql = new ConexionMysql();
            Connection conn = connMysql.open();
            CallableStatement pstm = (CallableStatement) conn.prepareCall(query);

            pstm.setInt(1, empleado.getIdEmpleado());
            pstm.setString(2, empleado.getPersona().getNombre());
            pstm.setString(3, empleado.getPersona().getApellidos());
            pstm.setString(4, empleado.getPersona().getTelefono());
            pstm.setString(5, empleado.getUsuario().getNombre());
            pstm.setString(6, empleado.getUsuario().getContrasenia());
            pstm.setInt(7, empleado.getCiudad().getIdCiudad());
            pstm.setBoolean(8, empleado.getActivo());
            pstm.setInt(9, empleado.getSucursal().getIdSucursal());

            // Ejecutar el procedimiento almacenado
            pstm.execute();

            pstm.close();
            connMysql.close();

        } catch (SQLException e) {
            e.printStackTrace();
            throw new SQLException("Error al actualizar el empleado: " + e.getMessage());
        }
        return empleado;
    }

    public void eliminarEmpleado(int idEmpleado) throws SQLException {
        String query = "{CALL sp_deleteEmpleado(?)}"; // Llamada al SP de eliminación lógica
        try {
            ConexionMysql connMysql = new ConexionMysql();
            Connection conn = connMysql.open();

            CallableStatement pstm = (CallableStatement) conn.prepareCall(query);

            // Pasar el id del cliente al procedimiento almacenado
            pstm.setInt(1, idEmpleado);

            // Ejecutar la actualización (eliminación lógica)
            pstm.execute();

            // Cerrar recursos
            pstm.close();
            connMysql.close();
            conn.close();
        } catch (SQLException e) {
            System.err.println("Error al eliminar cliente: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    public List<Sucursal> getAllSucursalesAct() throws SQLException {
        String sql = "SELECT * FROM viewSucursalesAct;";
        ConexionMysql connMysql = new ConexionMysql();
        Connection conn = connMysql.open();
        PreparedStatement pstmt = conn.prepareStatement(sql);
        ResultSet rs = pstmt.executeQuery();
        List<Sucursal> listaSucursales = new ArrayList<>();

        while (rs.next()) {
            listaSucursales.add(fillA(rs)); // Llama al método `fill` para mapear los datos
        }

        rs.close();
        pstmt.close();
        connMysql.close();

        return listaSucursales;
    }

    public Sucursal fillA(ResultSet rs) throws SQLException {
        Sucursal sucursales = new Sucursal();
        sucursales.setIdSucursal(rs.getInt("ID Sucursal"));
        sucursales.setNombre(rs.getString("Nombre"));

        return sucursales;
    } 
}
