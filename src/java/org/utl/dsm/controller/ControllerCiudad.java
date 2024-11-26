/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package org.utl.dsm.controller;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;
import org.utl.dsm.bd.ConexionMysql;
import org.utl.dsm.model.Ciudad;

/**
 *
 * @author ramir
 */
public class ControllerCiudad {
     public List<Ciudad> getCiudadesPorEstado(int idEstado) throws Exception {
        String sql = "SELECT idCiudad, nombre FROM ciudad WHERE idEstado = ?;";
        ConexionMysql connMysql = new ConexionMysql();
        Connection conn = connMysql.open();
        PreparedStatement pstmt = conn.prepareStatement(sql);
        pstmt.setInt(1, idEstado);
        ResultSet rs = pstmt.executeQuery();

        List<Ciudad> ciudades = new ArrayList<>();
        while (rs.next()) {
            Ciudad ciudad = new Ciudad();
            ciudad.setIdCiudad(rs.getInt("idCiudad"));
            ciudad.setNombre(rs.getString("nombre"));
            ciudades.add(ciudad);
        }

        rs.close();
        pstmt.close();
        connMysql.close();
        return ciudades;
    }
}