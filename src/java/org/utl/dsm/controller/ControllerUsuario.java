/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package org.utl.dsm.controller;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import java.sql.Connection;
import java.sql.Types;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import org.utl.dsm.bd.ConexionMysql;
import org.apache.commons.codec.digest.DigestUtils;

/**
 *
 * @author ramir
 */
public class ControllerUsuario {

    public boolean loginEmpleado(String nombre, String contrasenia) throws Exception {
        ConexionMysql conexion = new ConexionMysql();
        Connection conn = conexion.open();
        boolean valido = false;

        try {
            // Llama al procedimiento almacenado
            CallableStatement cstmt = conn.prepareCall("{CALL sp_iniciar_sesion_empleado(?, ?, ?)}");
            cstmt.setString(1, nombre);
            String hashPassw = DigestUtils.sha256Hex(contrasenia);
            cstmt.setString(2, hashPassw);
            cstmt.registerOutParameter(3, Types.BOOLEAN);
            cstmt.execute();

            // Obtiene el resultado del SP
            valido = cstmt.getBoolean(3);
        } catch (Exception e) {
            throw e;
        } finally {
            conexion.close();
        }
        return valido;
    }

    public boolean loginCliente(String nombre, String contrasenia, int[] clienteData) throws Exception {
        ConexionMysql conexion = new ConexionMysql();
        Connection conn = conexion.open();
        boolean valido = false;

        try {
            // Llama al procedimiento almacenado
            CallableStatement cstmt = conn.prepareCall("{CALL sp_iniciar_sesion_cliente(?, ?, ?, ?)}");
            cstmt.setString(1, nombre);
            String hashPassw = DigestUtils.sha256Hex(contrasenia);
            cstmt.setString(2, hashPassw);
            cstmt.registerOutParameter(3, Types.BOOLEAN); // Para el estado de validación
            cstmt.registerOutParameter(4, Types.INTEGER);  // Para el ID del cliente
            cstmt.execute();

            // Obtiene el resultado del SP
            valido = cstmt.getBoolean(3);
            if (valido) {
                clienteData[0] = cstmt.getInt(4); // ID del cliente
            } else {
                clienteData[0] = -1; // O un valor que indique que no se encontró el cliente
            }
        } catch (Exception e) {
            throw e;
        } finally {
            conexion.close();
        }
        return valido;
    }

public Map<String, Object> checkUser(String nombreU) throws Exception {
    String sql = "SELECT * FROM usuario WHERE nombre =" + "'" + nombreU + "';";
    ConexionMysql conexion = new ConexionMysql();
    Connection conn = conexion.open();
    PreparedStatement pstmt = conn.prepareStatement(sql);
    ResultSet rs = pstmt.executeQuery();
    String name = null;
    int rol = 0;
    String tok = null;
    String takenizer = null;
    Date myDate = new Date();
    String fecha = new SimpleDateFormat("yyyy.MM.dd.HH:mm:ss").format(myDate);
    String sql2 = "";
    
    Map<String, Object> result = new HashMap<>();
    
    while (rs.next()) {
        name = rs.getString("nombre");
        rol = rs.getInt("rol");
        tok = rs.getString(6);
        tok = tok.trim();

        if (!tok.isEmpty()) {
            takenizer = tok;
            sql2 = "UPDATE usuario SET dateLastToken = '" + fecha + "' WHERE nombre = '" + name + "';";
        } else {
            String token = "ZARAPE" + "." + name + "." + fecha;
            takenizer = DigestUtils.md5Hex(token);
            sql2 = "UPDATE usuario SET lastToken = '" + takenizer + "', dateLastToken = '" + fecha + "' WHERE nombre = '" + name + "';";
        }
        Connection connect = conexion.open();
        PreparedStatement ps = connect.prepareStatement(sql2);
        ps.executeUpdate();

        result.put("token", takenizer);
        result.put("rol", rol);
        return result;
    }
    
    result.put("name", name);
    result.put("rol", rol);
    return result;
}

    public boolean closeCheckUser(String nombreU) throws Exception {
        String sql = "UPDATE usuario SET lastToken = '' WHERE nombre = ?;";
        ConexionMysql conexion = new ConexionMysql();
        Connection conn = null;
        PreparedStatement pstmt = null;
        try {

            conn = conexion.open();
            pstmt = conn.prepareStatement(sql);
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, nombreU);

            int filaAfectada = pstmt.executeUpdate();

            return filaAfectada > 0;
        } catch (Exception e) {
            e.printStackTrace();
            throw new Exception("Error al cerrar sesión: " + e.getMessage());
        } finally {
            if (pstmt != null) {
                pstmt.close();
            }
            if (conn != null) {
                conn.close();
            }
        }

    }

    public String validateToken(String token) throws Exception {
        ConexionMysql conexion = new ConexionMysql();
        Connection conn = conexion.open();

        String sql = "SELECT nombre FROM usuario WHERE lastToken = ? AND NOT lastToken = '';";
        PreparedStatement pstmt = conn.prepareStatement(sql);
        pstmt.setString(1, token);

        ResultSet rs = pstmt.executeQuery();

        if (rs.next()) {
            return rs.getString("nombre"); 
        } else {
            return null; // Token no válido
        }
    }

}
