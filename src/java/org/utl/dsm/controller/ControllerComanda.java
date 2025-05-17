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
import org.utl.dsm.model.Bebida;
import org.utl.dsm.model.Categoria;
import org.utl.dsm.model.Cliente;
import org.utl.dsm.model.Comanda;
import org.utl.dsm.model.DetalleTicket;
import org.utl.dsm.model.Producto;
import org.utl.dsm.model.Ticket;

/**
 *
 * @author Miguel Hernandez
 */
public class ControllerComanda {
    // Método que obtiene las comandas filtradas por el estatus
    public List<Comanda> getComandasPorEstatus(String estatus) throws SQLException {
        String sql = "SELECT * FROM comanda_detalle WHERE estatus_comanda = ?;";
        ConexionMysql connMysql = new ConexionMysql();
        Connection conn = connMysql.open();
        PreparedStatement pstmt = conn.prepareStatement(sql);
        pstmt.setString(1, estatus);  // Establecemos el parámetro estatus en la consulta
        ResultSet rs = pstmt.executeQuery();
        List<Comanda> listacomanda = new ArrayList<>();
        while (rs.next()) {
            listacomanda.add(fill(rs));
        }
        rs.close();
        connMysql.close();
        return listacomanda;
    }

    // Método auxiliar para llenar la entidad Comanda
    public Comanda fill(ResultSet rs) throws SQLException {
        Comanda comanda = new Comanda();
        comanda.setIdComanda(rs.getInt("idComanda"));
        comanda.setEstatus(rs.getString("estatus_comanda"));
        comanda.setFechaHoraRegistro(rs.getTimestamp("fechaHoraRegistro"));

        // Ticket
        Ticket ticket = new Ticket();
        ticket.setIdTicket(rs.getInt("idTicket"));
        ticket.setFecha(rs.getDate("fecha_ticket"));
        ticket.setPagado(rs.getString("ticket_pagado"));
        
        // Cliente
        Cliente cliente = new Cliente();
        cliente.setIdCliente(rs.getInt("idCliente"));
        ticket.setIdCliente(cliente.getIdCliente());

        // DetalleTicket
        DetalleTicket detalleTicket = new DetalleTicket();
        detalleTicket.setIdTicket(ticket.getIdTicket());
        detalleTicket.setCantidad(rs.getInt("cantidad_producto"));
        detalleTicket.setPrecio(rs.getDouble("precio_producto"));

        // Producto
        Producto producto = new Producto();
        producto.setIdProducto(rs.getInt("idProducto"));
        producto.setNombre(rs.getString("producto"));
        producto.setPrecio(rs.getDouble("precio_producto"));

        // Asignaciones
        detalleTicket.setProducto(producto);
        ticket.setDetalleTicket(detalleTicket);
        comanda.setTicket(ticket);

        return comanda;
    }
    public List<Comanda> getComanda() throws SQLException {
        String sql = "SELECT * FROM comanda_detalle;";
        ConexionMysql connMysql = new ConexionMysql();
        Connection conn = connMysql.open();
        PreparedStatement pstmt = conn.prepareStatement(sql); // Establecemos el parámetro estatus en la consulta
        ResultSet rs = pstmt.executeQuery();
        List<Comanda> listacomanda = new ArrayList<>();
        while (rs.next()) {
            listacomanda.add(fill(rs));
        }
        rs.close();
        connMysql.close();
        return listacomanda;
    }

    
        public void updateEstatusComanda(Comanda co) throws SQLException {
        System.out.println("Llegamos al controller");
        String query = "CALL actualizar_estatus_comanda(?,?);"; //agregar un campo para que reciba 7 parametros
        ConexionMysql connMysql = new ConexionMysql();
        Connection conn = connMysql.open();
        CallableStatement cstm = (CallableStatement) conn.prepareCall(query);
        // Usar el idProducto de la clase base Producto
        cstm.setInt(1, co.getIdComanda()); // Recibir el ID del producto
        cstm.setString(2, co.getEstatus());
        cstm.execute();
        // Cerramos todos los objetos de conexión
        cstm.close();
        connMysql.close();
        conn.close();
    }

}
