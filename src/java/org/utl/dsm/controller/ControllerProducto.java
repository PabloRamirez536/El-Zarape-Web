package org.utl.dsm.controller;

import com.mysql.cj.jdbc.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import javax.lang.model.util.Types;
import org.utl.dsm.bd.ConexionMysql;
import org.utl.dsm.model.Alimento;
import org.utl.dsm.model.Bebida;
import org.utl.dsm.model.Categoria;
import org.utl.dsm.model.Producto;
import org.utl.dsm.model.ProductoResponse;

/**
 *
 * @author ramir
 */
public class ControllerProducto {

    public ProductoResponse getProductoById(int id) throws SQLException {
        ProductoResponse response = new ProductoResponse();
        String sql = "SELECT p.*, a.idAlimento, b.idBebida, c.descripcion AS categoria "
                + "FROM producto p "
                + "LEFT JOIN alimento a ON p.idProducto = a.idProducto "
                + "LEFT JOIN bebida b ON p.idProducto = b.idProducto "
                + "LEFT JOIN categoria c ON p.idCategoria = c.idCategoria "
                + "WHERE p.idProducto = ?";

        ConexionMysql connMysql = new ConexionMysql();
        Connection conn = connMysql.open();
        PreparedStatement pstmt = conn.prepareStatement(sql);
        pstmt.setInt(1, id);

        ResultSet rs = pstmt.executeQuery();
        if (rs.next()) {
            if (rs.getInt("idAlimento") > 0) {
                response.setAlimento(fillAlimento(rs));
            }
            if (rs.getInt("idBebida") > 0) {
                response.setBebida(fillBebida(rs));
            }
        }

        rs.close();
        connMysql.close();
        return response;
    }

    public Alimento fillAlimento(ResultSet rs) throws SQLException {
        Producto pr = new Producto();
        pr.setIdProducto(rs.getInt("idProducto"));
        pr.setNombre(rs.getString("nombre"));
        pr.setDescripcion(rs.getString("descripcion"));
        pr.setFoto(rs.getString("foto"));
        pr.setPrecio(rs.getDouble("precio"));
        pr.setIdCategoria(rs.getInt("idCategoria"));
        pr.setActivo(rs.getBoolean("activo"));

        Categoria categoria = new Categoria();
        // Asigna la descripción de la categoría si está disponible en el ResultSet
        categoria.setDescripcion(rs.getString("categoria"));

        Alimento al = new Alimento();
        al.setIdAlimento(rs.getInt("idAlimento"));
        al.setIdProducto(rs.getInt("idProducto"));
        al.setProducto(pr);
        al.setCategoria(categoria); // Asocia la categoría al alimento

        return al;
    }

    public Bebida fillBebida(ResultSet rs) throws SQLException {
        Producto pr = new Producto();
        pr.setIdProducto(rs.getInt("idProducto"));
        pr.setNombre(rs.getString("nombre"));
        pr.setDescripcion(rs.getString("descripcion"));
        pr.setFoto(rs.getString("foto"));
        pr.setPrecio(rs.getDouble("precio"));
        pr.setIdCategoria(rs.getInt("idCategoria"));
        pr.setActivo(rs.getBoolean("activo"));

        Categoria ca = new Categoria();
        ca.setDescripcion(rs.getString("categoria")); // Asigna la descripción de la categoría

        Bebida be = new Bebida();
        be.setIdBebida(rs.getInt("idBebida"));
        be.setIdProducto(rs.getInt("idProducto"));
        be.setCategoria(ca);
        be.setProducto(pr);

        return be;
    }

}
