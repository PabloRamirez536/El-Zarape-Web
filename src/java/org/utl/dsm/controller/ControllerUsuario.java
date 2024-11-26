/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package org.utl.dsm.controller;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.Types;
import org.utl.dsm.bd.ConexionMysql;

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
            cstmt.setString(2, contrasenia);
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
            cstmt.setString(2, contrasenia);
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
}
