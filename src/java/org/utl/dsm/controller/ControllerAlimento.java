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
import org.utl.dsm.model.Categoria;
import org.utl.dsm.model.Producto;

public class ControllerAlimento {

    public List<Alimento> getAllAlimento() throws SQLException {
        String sql = "SELECT * FROM productos_alimentos;";
        ConexionMysql connMysql = new ConexionMysql();
        Connection conn = connMysql.open();
        PreparedStatement pstmt = conn.prepareStatement(sql);
        ResultSet rs = pstmt.executeQuery();
        List<Alimento> listaAlimentos = new ArrayList<>();
        while (rs.next()) {
            listaAlimentos.add(fill(rs));
        }
        rs.close();
        connMysql.close();
        return listaAlimentos;
    }

    private Alimento fill(ResultSet rs) throws SQLException {
    Producto pr = new Producto();
    pr.setIdProducto(rs.getInt("idProducto"));
    pr.setNombre(rs.getString("nombre"));
    pr.setDescripcion(rs.getString("descripcion"));
    pr.setFoto(rs.getString("foto") != null ? rs.getString("foto") : "default.jpg");
    pr.setPrecio(rs.getDouble("precio"));
    pr.setIdCategoria(rs.getInt("idCategoria"));
    pr.setActivo(rs.getBoolean("activo"));

    Categoria categoria = new Categoria();
    categoria.setIdCategoria(rs.getInt("idCategoria"));
    categoria.setDescripcion(rs.getString("categoria_descripcion")); // Asegúrate de que este campo exista en tu SQL

    Alimento al = new Alimento();
    al.setIdAlimento(rs.getInt("idAlimento"));
    al.setIdProducto(rs.getInt("idProducto"));
    al.setProducto(pr);
    al.setCategoria(categoria); // Asocia la categoría al alimento

    return al;
}


    public Alimento insertAlimentoObjeto(Alimento al) {
        String query = "CALL insertProductoAlimento(?, ?, ?, ?, ?, ?)";
        try {
            ConexionMysql connMysql = new ConexionMysql();
            Connection conn = connMysql.open();
            CallableStatement pstm = (CallableStatement) conn.prepareCall(query);
            pstm.setString(1, al.getProducto().getNombre());
            pstm.setString(2, al.getProducto().getDescripcion());
            pstm.setString(3, al.getProducto().getFoto());
            pstm.setDouble(4, al.getProducto().getPrecio());
            pstm.setBoolean(5, al.getProducto().getActivo());
            pstm.setInt(6, al.getCategoria().getIdCategoria());

            // Ejecutar el procedimiento almacenado y obtener el ID del producto insertado
            boolean hasResults = pstm.execute();
            if (hasResults) {
                ResultSet rs = pstm.getResultSet();
                if (rs.next()) {
                    int idProductoGenerado = rs.getInt(1);
                    al.setIdProducto(idProductoGenerado);
                    System.out.println("Insert correcto, ID generado: " + idProductoGenerado);
                }
            }

            pstm.close();
            connMysql.close();
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException("Error en la inserción: " + e.getMessage());
        }
        return al;
    }

    public void updateAlimentoObjeto(Alimento al) throws SQLException {
        if (al == null || al.getProducto() == null) {
            throw new IllegalArgumentException("Alimento o Producto no pueden ser nulos");
        }
        System.out.println("Llegamos al controller");
        System.out.println("Nombre: " + al.getProducto().getNombre());
        String query = "CALL updateProductoAlimento(?,?,?,?,?,?,?);"; //agregar un campo para que reciba 7 parametros
        ConexionMysql connMysql = new ConexionMysql();
        Connection conn = connMysql.open();
        CallableStatement cstm = (CallableStatement) conn.prepareCall(query);
        // Usar el idProducto de la clase base Producto
        cstm.setInt(1, al.getIdProducto()); // Recibir el ID del producto
        cstm.setString(2, al.getProducto().getNombre());
        cstm.setString(3, al.getProducto().getDescripcion());
        cstm.setString(4, al.getProducto().getFoto());
        cstm.setDouble(5, al.getProducto().getPrecio());
        cstm.setBoolean(6, al.getProducto().getActivo());
        cstm.setInt(7, al.getCategoria().getIdCategoria());// agregar el 7 campo que sera el idCategoria
        // Ejecutamos el PreparedStatement
        cstm.execute();

        // Cerramos todos los objetos de conexión
        cstm.close();
        connMysql.close();
        conn.close();
    }

    public void eliminarAlimento(int idProducto) throws SQLException {
        String query = "CALL deleteProductoAlimento(?);";
        ConexionMysql connMysql = new ConexionMysql();
        Connection conn = connMysql.open();
        CallableStatement cstm = (CallableStatement) conn.prepareCall(query);
        cstm.setInt(1, idProducto);
        // Ejecutamos el PreparedStatement 
        cstm.execute();
        //Cerramos todos nuestros objetos de conexión con el servidor
        cstm.close();
        connMysql.close();
        conn.close();
    }
    
    
    public List<Categoria> getAllCategoriaAlimento() throws SQLException {
        String sql = "SELECT * FROM categorias WHERE tipo = 'A' AND activo = 1";
        ConexionMysql connMysql = new ConexionMysql();
        Connection conn = connMysql.open();
        PreparedStatement pstmt = conn.prepareStatement(sql);
        ResultSet rs = pstmt.executeQuery();
        List<Categoria> listaCategorias = new ArrayList<>();
        while (rs.next()) {
            listaCategorias.add(fillCategoria(rs));
        }
        rs.close();
        connMysql.close();
        return listaCategorias;
    }
    
    public Categoria fillCategoria(ResultSet rs) throws SQLException {
        Categoria c = new Categoria();
        c.setIdCategoria(rs.getInt("idCategoria"));
        c.setDescripcion(rs.getString("descripcion"));
        c.setTipo(rs.getString("tipo"));
        c.setActivo(rs.getBoolean("activo"));
        return c;
    }

}
