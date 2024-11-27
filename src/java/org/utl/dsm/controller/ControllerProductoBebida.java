package org.utl.dsm.controller;

import com.mysql.cj.jdbc.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import org.utl.dsm.bd.ConexionMysql;
import org.utl.dsm.model.Bebida;
import org.utl.dsm.model.Categoria;
import org.utl.dsm.model.Producto;

/**
 *
 * @author Miguel Hernandez
 */
public class ControllerProductoBebida {

    public Bebida insertBebidaObjeto(Bebida b) {
        System.out.println("lo que llega al statement");
        System.out.println(b.getProducto().getNombre());
        String query = "CALL insertProductoBebida(?,?,?,?,?,?)";
        try {
            ConexionMysql connMysql = new ConexionMysql();
            Connection conn = connMysql.open();
            CallableStatement pstm = (CallableStatement) conn.prepareCall(query);
            pstm.setString(1, b.getProducto().getNombre());
            pstm.setString(2, b.getProducto().getDescripcion());
            pstm.setString(3, b.getProducto().getFoto());
            pstm.setDouble(4, b.getProducto().getPrecio());
            pstm.setBoolean(5, b.getProducto().getActivo());
            pstm.setInt(6, b.getCategoria().getIdCategoria());
            pstm.execute();
            System.out.println("Insert correcto");
            pstm.close();
            connMysql.close();
        } catch (SQLException e) {
            e.printStackTrace(); // Cambiado para obtener el mensaje de error
        }
        return b;
    }

    public void updateBebidaObjeto(Bebida b) throws SQLException {
        if (b == null || b.getProducto() == null) {
            throw new IllegalArgumentException("Bebida o Producto no pueden ser nulos");
        }
        System.out.println("Llegamos al controller");
        System.out.println("Nombre: " + b.getProducto().getNombre());
        String query = "CALL updateProductoBebida(?,?,?,?,?,?,?);"; //agregar un campo para que reciba 7 parametros
        ConexionMysql connMysql = new ConexionMysql();
        Connection conn = connMysql.open();
        CallableStatement cstm = (CallableStatement) conn.prepareCall(query);
        // Usar el idProducto de la clase base Producto
        cstm.setInt(1, b.getIdProducto()); // Recibir el ID del producto
        cstm.setString(2, b.getProducto().getNombre());
        cstm.setString(3, b.getProducto().getDescripcion());
        cstm.setString(4, b.getProducto().getFoto());
        cstm.setDouble(5, b.getProducto().getPrecio());
        cstm.setBoolean(6, b.getProducto().getActivo());
        cstm.setInt(7, b.getCategoria().getIdCategoria());// agregar el 7 campo que sera el idCategoria
        // Ejecutamos el PreparedStatement
        cstm.execute();

        // Cerramos todos los objetos de conexión
        cstm.close();
        connMysql.close();
        conn.close();
    }

    public List<Bebida> getAllObjetoBebida() throws SQLException {
        String sql = "SELECT * FROM productos_bebidas WHERE tipo = 'B';";
        ConexionMysql connMysql = new ConexionMysql();
        Connection conn = connMysql.open();
        PreparedStatement pstmt = conn.prepareStatement(sql);
        ResultSet rs = pstmt.executeQuery();
        List<Bebida> listabebidas = new ArrayList<>();
        while (rs.next()) {
            listabebidas.add(fill(rs));
        }
        rs.close();
        connMysql.close();
        return listabebidas;
    }

    public Bebida fill(ResultSet rs) throws SQLException {
        Producto pr = new Producto();
        pr.setIdProducto(rs.getInt("idProducto"));
        pr.setNombre(rs.getString("nombre"));
        pr.setDescripcion(rs.getString("descripcion"));
        pr.setFoto(rs.getString("foto"));
        pr.setPrecio(rs.getDouble("precio"));
        pr.setIdCategoria(rs.getInt("idCategoria"));
        pr.setActivo(rs.getBoolean("activo"));
        Categoria ca = new Categoria();
        ca.setDescripcion(rs.getString("categoria"));
        Bebida be = new Bebida();
        be.setIdBebida(rs.getInt("idBebida"));
        be.setIdProducto(rs.getInt("idProducto"));
        be.setCategoria(ca);
        be.setProducto(pr);
        return be;
    }

    public List<Categoria> getAllCategoriaBebida() throws SQLException {
        String sql = "SELECT * FROM categorias WHERE tipo = 'B'";
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

    public void eliminarBebida(int idProducto) throws SQLException {
        String query = "CALL deleteProductoBebida(?);";
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
}
