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
import org.utl.dsm.model.Cliente;
import org.utl.dsm.model.Estado;
import org.utl.dsm.model.Persona;
import org.utl.dsm.model.Usuario;

/**
 *
 * @author ramir
 */
public class ControllerCliente {

    public List<Cliente> getAllClientes() throws SQLException {
        String sql = "SELECT * FROM vista_clientes_detallada;";
        ConexionMysql connMysql = new ConexionMysql();
        Connection conn = connMysql.open();
        PreparedStatement pstmt = conn.prepareStatement(sql);
        ResultSet rs = pstmt.executeQuery();
        List<Cliente> listaClientes = new ArrayList<>();

        while (rs.next()) {
            listaClientes.add(fill(rs)); // Llama al método `fill` para mapear los datos
        }

        rs.close();
        pstmt.close();
        connMysql.close();

        return listaClientes;
    }

    public Cliente fill(ResultSet rs) throws SQLException {
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

        Cliente cliente = new Cliente();
        cliente.setIdCliente(rs.getInt("ID Cliente"));
        cliente.setActivo(rs.getString("Estatus").equals("Activo"));
        cliente.setPersona(persona);
        cliente.setUsuario(usuario);
        cliente.setCiudad(ciudad);
        cliente.setEstado(estado);

        return cliente; // Devuelve el objeto Cliente completamente mapeado
    }

    public Cliente insertarCliente(Cliente cliente) throws SQLException {
        String query = "{CALL sp_insertCliente(?, ?, ?, ?, ?, ?)}";
        boolean resultado = false;

        try {
            ConexionMysql connMysql = new ConexionMysql();
            Connection conn = connMysql.open();
            CallableStatement pstm = (CallableStatement) conn.prepareCall(query);

            pstm.setString(1, cliente.getPersona().getNombre());
            pstm.setString(2, cliente.getPersona().getApellidos());
            pstm.setString(3, cliente.getPersona().getTelefono());
            pstm.setString(4, cliente.getUsuario().getNombre());
            pstm.setString(5, cliente.getUsuario().getContrasenia());
            pstm.setInt(6, cliente.getCiudad().getIdCiudad());

            pstm.execute();
            pstm.close();
            connMysql.close();

        } catch (SQLException e) {
            e.getStackTrace();
        }
        return cliente;
    }

    public Cliente actualizarCliente(Cliente cliente) throws SQLException {
        String query = "{CALL sp_updateCliente(?, ?, ?, ?, ?, ?, ?, ?)}";

        try {
            ConexionMysql connMysql = new ConexionMysql();
            Connection conn = connMysql.open();
            CallableStatement pstm = (CallableStatement) conn.prepareCall(query);

            pstm.setInt(1, cliente.getIdCliente());
            pstm.setString(2, cliente.getPersona().getNombre());
            pstm.setString(3, cliente.getPersona().getApellidos());
            pstm.setString(4, cliente.getPersona().getTelefono());
            pstm.setString(5, cliente.getUsuario().getNombre());
            pstm.setString(6, cliente.getUsuario().getContrasenia());
            pstm.setInt(7, cliente.getCiudad().getIdCiudad());
            pstm.setBoolean(8, cliente.getActivo());

            // Ejecutar el procedimiento almacenado
            pstm.execute();

            pstm.close();
            connMysql.close();

        } catch (SQLException e) {
            e.printStackTrace();
            throw new SQLException("Error al actualizar el cliente: " + e.getMessage());
        }
        return cliente;
    }

    public void eliminarCliente(int idCliente) throws SQLException {
        String query = "{CALL sp_deleteCliente(?)}"; // Llamada al SP de eliminación lógica
        try {
            ConexionMysql connMysql = new ConexionMysql();
            Connection conn = connMysql.open();

            CallableStatement pstm = (CallableStatement) conn.prepareCall(query);

            // Pasar el id del cliente al procedimiento almacenado
            pstm.setInt(1, idCliente);

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

    public Cliente getClientePorId(int idCliente) throws SQLException {
        String query = "{CALL sp_getClientePorId(?)}";
        ConexionMysql connMysql = new ConexionMysql();
        Connection conn = connMysql.open();
        CallableStatement pstm = (CallableStatement) conn.prepareCall(query);
        pstm.setInt(1, idCliente);

        ResultSet rs = pstm.executeQuery();
        Cliente cliente = null;

        if (rs.next()) {
            cliente = fill(rs); // Mapea el resultado a un objeto Cliente
        }

        rs.close();
        pstm.close();
        connMysql.close();

        return cliente; // Devuelve el objeto Cliente o null
    }

}
