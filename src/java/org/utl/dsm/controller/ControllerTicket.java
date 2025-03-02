package org.utl.dsm.controller;

import org.utl.dsm.bd.ConexionMysql;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.List;
import org.utl.dsm.model.DetalleTicket;
/**
 *
 * @author ramir
 */
public class ControllerTicket {

    public int registrarTicket(int idCliente, int idSucursal) {
        ConexionMysql connMysql = new ConexionMysql();
        int idTicket = -1;

        try (Connection conn = connMysql.open()) {
            String sql = "INSERT INTO ticket (ticket, fecha, pagado, idCliente, idSucursal, estatus) VALUES ('S', CURDATE(), 'S', ?, ?, 1)";
            PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            stmt.setInt(1, idCliente);
            stmt.setInt(2, idSucursal);
            stmt.executeUpdate();

            ResultSet rs = stmt.getGeneratedKeys();
            if (rs.next()) {
                idTicket = rs.getInt(1);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return idTicket;
    }

    public void registrarDetalleTicket(int idTicket, List<DetalleTicket> detalles) {
        ConexionMysql connMysql = new ConexionMysql();
        try (Connection conn = connMysql.open()) {
            String sql = "INSERT INTO detalle_ticket (idTicket, cantidad, precio, idCombo, idProducto) VALUES (?, ?, ?, ?, ?)";
            PreparedStatement stmt = conn.prepareStatement(sql);

            for (DetalleTicket detalle : detalles) {
                stmt.setInt(1, idTicket);
                stmt.setInt(2, detalle.getCantidad());
                stmt.setDouble(3, detalle.getPrecio());
                stmt.setInt(4, detalle.getIdCombo());
                stmt.setInt(5, detalle.getIdProducto());
                stmt.addBatch();
            }
            stmt.executeBatch();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void registrarComanda(int idTicket) {
        ConexionMysql connMysql = new ConexionMysql();
        try (Connection conn = connMysql.open()) {
            String sql = "INSERT INTO comanda (idTicket, estatus) VALUES (?, 1)";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setInt(1, idTicket);
            stmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
