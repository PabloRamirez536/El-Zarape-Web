package org.utl.dsm.model;


import java.sql.Timestamp;

/**
 *
 * @author ramir
 */
public class Comanda {
    private int idComanda;
    private int idTicket;
    private String estatus;
    private Ticket ticket;
    private Timestamp fechaHoraRegistro;

    public Comanda() {
    }

    public Comanda(int idComanda, int idTicket, String estatus, Ticket ticket, Timestamp fechaHoraRegistro) {
        this.idComanda = idComanda;
        this.idTicket = idTicket;
        this.estatus = estatus;
        this.ticket = ticket;
        this.fechaHoraRegistro = fechaHoraRegistro;
    }

    public int getIdComanda() {
        return idComanda;
    }

    public void setIdComanda(int idComanda) {
        this.idComanda = idComanda;
    }

    public int getIdTicket() {
        return idTicket;
    }

    public void setIdTicket(int idTicket) {
        this.idTicket = idTicket;
    }

    public String getEstatus() {
        return estatus;
    }

    public void setEstatus(String estatus) {
        this.estatus = estatus;
    }

    public Ticket getTicket() {
        return ticket;
    }

    public void setTicket(Ticket ticket) {
        this.ticket = ticket;
    }

    public Timestamp getFechaHoraRegistro() {
        return fechaHoraRegistro;
    }

    public void setFechaHoraRegistro(Timestamp fechaHoraRegistro) {
        this.fechaHoraRegistro = fechaHoraRegistro;
    }

    
}

