package org.utl.dsm.controller;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;
import org.utl.dsm.bd.ConexionMysql;
import org.utl.dsm.model.Sucursal;
import java.sql.SQLException;
import org.utl.dsm.model.Ciudad;
import org.utl.dsm.model.Estado;
import com.mysql.cj.jdbc.CallableStatement;

public class ControllerSucursal {

    public List<Sucursal> getAllSucursales() throws SQLException {
        String sql = "SELECT * FROM viewSucursales";
        ConexionMysql connMysql = new ConexionMysql();
        Connection conn = connMysql.open();
        PreparedStatement pstmt = conn.prepareStatement(sql);
        ResultSet rs = pstmt.executeQuery();
        List<Sucursal> listaSucursales = new ArrayList<>();

        while (rs.next()) {
            listaSucursales.add(fill(rs)); // Llama al método `fill` para mapear los datos
        }

        rs.close();
        pstmt.close();
        connMysql.close();

        return listaSucursales;
    }

    public Sucursal fill(ResultSet rs) throws SQLException {
        Sucursal sucursales = new Sucursal();
        sucursales.setIdSucursal(rs.getInt("ID Sucursal"));
        sucursales.setNombre(rs.getString("Nombre"));
        sucursales.setLatitud(rs.getString("Latitud"));
        sucursales.setLongitud(rs.getString("Longitud"));
        sucursales.setFoto(rs.getString("Foto"));
        sucursales.setUrlWeb(rs.getString("urlWeb"));
        sucursales.setHorarios(rs.getString("Horarios"));
        sucursales.setDireccion(rs.getString("Dirección")); // Obtiene la dirección ya concatenada desde la vista
        sucursales.setActivo(rs.getString("Estatus").equals("Activo"));

        Ciudad ciudad = new Ciudad();
        ciudad.setIdCiudad(rs.getInt("idCiudad"));
        ciudad.setNombre(rs.getString("Ciudad"));

        Estado estado = new Estado();
        estado.setIdEstado(rs.getInt("idEstado"));
        estado.setNombre(rs.getString("Estado"));

        sucursales.setCiudadNombre(ciudad);
        sucursales.setEstadoNombre(estado);

        return sucursales;
    }

    public Sucursal insertSucursal(Sucursal sucursal) throws SQLException {
        String query = "{CALL sp_insertSucursal(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}";

        try {
            ConexionMysql connMysql = new ConexionMysql();
            Connection conn = connMysql.open();
            CallableStatement pstm = (CallableStatement) conn.prepareCall(query);

            // Configurar los parámetros
            pstm.setString(1, sucursal.getNombre());
            pstm.setString(2, sucursal.getLatitud());
            pstm.setString(3, sucursal.getLongitud());
            pstm.setString(4, sucursal.getFoto());
            pstm.setString(5, sucursal.getUrlWeb());
            pstm.setString(6, sucursal.getHorarios());
            pstm.setString(7, sucursal.getCalle());
            pstm.setString(8, sucursal.getNumCalle());
            pstm.setString(9, sucursal.getColonia());
            pstm.setInt(10, sucursal.getCiudadNombre().getIdCiudad());

            // Ejecutar y obtener el resultado
            ResultSet rs = pstm.executeQuery();
            if (rs.next()) {
                sucursal.setIdSucursal(rs.getInt("idSucursal"));
                sucursal.setNombre(rs.getString("nombre"));
                sucursal.setLatitud(rs.getString("latitud"));
                sucursal.setLongitud(rs.getString("longitud"));
                sucursal.setFoto(rs.getString("foto"));
                sucursal.setUrlWeb(rs.getString("urlWeb"));
                sucursal.setHorarios(rs.getString("horarios"));
                sucursal.setCalle(rs.getString("direccion").split(",")[0]);
                sucursal.setNumCalle(rs.getString("direccion").split(",")[1].split(" ")[0]);
                sucursal.setColonia(rs.getString("direccion").split(",")[1].split(" ")[1]);

                Ciudad ciudad = new Ciudad();
                ciudad.setIdCiudad(rs.getInt("ciudadId"));
                ciudad.setNombre(rs.getString("ciudadNombre"));
                sucursal.setCiudadNombre(ciudad);

                sucursal.setActivo(rs.getBoolean("activo"));
            }

            pstm.close();
            connMysql.close();

        } catch (SQLException e) {
            if (e.getSQLState().equals("45000")) {
                throw new SQLException("Error: " + e.getMessage()); // El mensaje de error será el que defines en el SP
            }
            throw e;
        }

        return sucursal;
    }

    // Método para actualizar la sucursal
    public Sucursal updateSucursal(Sucursal sucursal) throws SQLException {
        String query = "{CALL sp_updateSucursal(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}";
        try {
            ConexionMysql connMysql = new ConexionMysql();
            Connection conn = connMysql.open();
            CallableStatement pstm = (CallableStatement) conn.prepareCall(query);

            // Asignar los valores de la sucursal a los parámetros del procedimiento almacenado
            pstm.setInt(1, sucursal.getIdSucursal());
            pstm.setString(2, sucursal.getNombre());
            pstm.setString(3, sucursal.getLatitud());
            pstm.setString(4, sucursal.getLongitud());
            pstm.setString(5, sucursal.getFoto());
            pstm.setString(6, sucursal.getUrlWeb());
            pstm.setString(7, sucursal.getHorarios());
            pstm.setString(8, sucursal.getCalle());
            pstm.setString(9, sucursal.getNumCalle());
            pstm.setString(10, sucursal.getColonia());
            pstm.setInt(11, sucursal.getCiudadNombre().getIdCiudad());  // Asegúrate de que 'ciudadNombre' esté correctamente asignado
            pstm.setBoolean(12, sucursal.isActivo());

            // Ejecutar y obtener el resultado
            ResultSet rs = pstm.executeQuery();
            if (rs.next()) {
                sucursal.setIdSucursal(rs.getInt("idSucursal"));
                sucursal.setNombre(rs.getString("nombre"));
                sucursal.setLatitud(rs.getString("latitud"));
                sucursal.setLongitud(rs.getString("longitud"));
                sucursal.setFoto(rs.getString("foto"));
                sucursal.setUrlWeb(rs.getString("urlWeb"));
                sucursal.setHorarios(rs.getString("horarios"));
                sucursal.setCalle(rs.getString("calle")); // Calle individual
                sucursal.setNumCalle(rs.getString("numCalle")); // Número Calle individual
                sucursal.setColonia(rs.getString("colonia")); // Colonia individual

                Ciudad ciudad = new Ciudad();
                ciudad.setIdCiudad(rs.getInt("ciudadId"));
                ciudad.setNombre(rs.getString("ciudadNombre"));
                sucursal.setCiudadNombre(ciudad);

                sucursal.setActivo(rs.getBoolean("activo"));
            }

        } catch (SQLException e) {
            e.printStackTrace();
            throw new SQLException("Error al actualizar la sucursal: " + e.getMessage());
        }
        return sucursal;
    }

    // Método para eliminar una sucursal de la base de datos
    public void deleteSucursal(int idSucursal) throws SQLException {
        String query = "{CALL sp_deleteSucursal(?)}";
        ConexionMysql connMysql = new ConexionMysql();
        Connection conn = null;
        CallableStatement pstm = null;
        try {
            conn = connMysql.open();
            pstm = (CallableStatement) conn.prepareCall(query);
            pstm.setInt(1, idSucursal);
            pstm.execute();
        } catch (SQLException e) {
            // Si ocurre un error real, imprime el mensaje
            System.err.println("Error al eliminar la sucursal: " + e.getMessage());
            throw e; // Lanza la excepción si hay un error real
        } finally {
            // Asegúrate de cerrar los recursos
            if (pstm != null) {
                pstm.close();
            }
            if (conn != null) {
                conn.close();
            }
        }
    }

}
