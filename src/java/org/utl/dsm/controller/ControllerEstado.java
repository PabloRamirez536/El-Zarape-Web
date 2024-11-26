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
import org.utl.dsm.model.Estado;

/**
 *
 * @author ramir
 */
public class ControllerEstado {
    
    public List<Estado> getAllEstados() throws Exception {
        String sql = "SELECT idEstado, nombre FROM estado;";
        ConexionMysql connMysql = new ConexionMysql();
        Connection conn = connMysql.open();
        PreparedStatement pstmt = conn.prepareStatement(sql);
        ResultSet rs = pstmt.executeQuery();

        List<Estado> estados = new ArrayList<>();
        while (rs.next()) {
            Estado estado = new Estado();
            estado.setIdEstado(rs.getInt("idEstado"));
            estado.setNombre(rs.getString("nombre"));
            estados.add(estado);
        }

        rs.close();
        pstmt.close();
        connMysql.close();
        return estados;
    }
}