package org.utl.dsm.model;

/**
 *
 * @author ramir
 */
public class Comanda {
    private int idComanda;
    private int idTicket;
    private int estatus;

    public Comanda() {
    }

    public Comanda(int idComanda, int idTicket, int estatus) {
        this.idComanda = idComanda;
        this.idTicket = idTicket;
        this.estatus = estatus;
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

    public int getEstatus() {
        return estatus;
    }

    public void setEstatus(int estatus) {
        this.estatus = estatus;
    }
}
