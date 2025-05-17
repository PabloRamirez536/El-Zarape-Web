/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package org.utl.dsm.model;

/**
 *
 * @author ramir
 */
public class Estado {
    private int idEstado;
    private String nombre;

    public Estado() {}

    public Estado(int idEstado, String nombre) {
        this.idEstado = idEstado;
        this.nombre = nombre;
    }

    // Getters y Setters
    public int getIdEstado() {
        return idEstado;
    }

    public void setIdEstado(int idEstado) {
        this.idEstado = idEstado;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}
