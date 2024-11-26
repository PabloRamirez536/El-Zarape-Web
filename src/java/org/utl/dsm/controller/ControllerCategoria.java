package org.utl.dsm.controller;

import com.mysql.cj.jdbc.CallableStatement;
import org.utl.dsm.bd.ConexionMysql;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;
import org.utl.dsm.model.Categoria;

public class ControllerCategoria {

    public Categoria insertCategoria(Categoria c) {
        String query = "CALL insertCategoria(?, ?, ?)";
        try {
            ConexionMysql connMysql = new ConexionMysql();
            Connection conn = connMysql.open();
            CallableStatement pstm = (CallableStatement) conn.prepareCall(query);
            pstm.setString(1, c.getDescripcion());
            pstm.setString(2, c.getTipo());
            pstm.setBoolean(3, c.getActivo());
            pstm.execute();
            pstm.close();
            connMysql.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return c;
    }

    public List<Categoria> getAllCategorias() throws SQLException {
        String sql = "SELECT * FROM categorias";
        ConexionMysql connMysql = new ConexionMysql();
        Connection conn = connMysql.open();
        PreparedStatement pstmt = conn.prepareStatement(sql);
        ResultSet rs = pstmt.executeQuery();
        List<Categoria> listaCategorias = new ArrayList<>();
        while (rs.next()) {
            listaCategorias.add(fill(rs));
        }
        rs.close();
        connMysql.close();
        return listaCategorias;
    }

    public Categoria fill(ResultSet rs) throws SQLException {
        Categoria c = new Categoria();
        c.setIdCategoria(rs.getInt("idCategoria"));
        c.setDescripcion(rs.getString("descripcion"));
        c.setTipo(rs.getString("tipo"));
        c.setActivo(rs.getBoolean("activo"));
        return c;
    }

    public void update(Categoria c) throws SQLException {
        String query = "CALL updateCategoria(?, ?, ?, ?)";
        ConexionMysql connMysql = new ConexionMysql();
        Connection conn = connMysql.open();
        CallableStatement cstm = (CallableStatement) conn.prepareCall(query);
        cstm.setInt(1, c.getIdCategoria());
        cstm.setString(2, c.getDescripcion());
        cstm.setString(3, c.getTipo());
        cstm.setBoolean(4, c.getActivo());
        cstm.execute();
        cstm.close();
        connMysql.close();
        conn.close();
    }

    public void delete(int idCategoria) throws SQLException {
        String query = "{CALL deleteCategoria(?)}";
        ConexionMysql connMysql = new ConexionMysql();
        Connection conn = connMysql.open();
        CallableStatement cstm = (CallableStatement) conn.prepareCall(query);
        cstm.setInt(1, idCategoria);
        cstm.execute();
        cstm.close();
        connMysql.close();
        conn.close();
    }
}
