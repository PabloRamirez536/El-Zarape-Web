/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package org.utl.dsm.model;

/**
 *
 * @author Miguel Hernandez
 */
public class Categoria {
    
    private int idCategoria;  // idCategoria de tipo INT, clave primaria
    private String descripcion;  // descripcion de tipo VARCHAR(45)
    private String tipo;  // tipo de categoría, A para alimentos, B para bebidas, etc.
    private boolean activo;  // activo de tipo INT, 1 si está activo, 0 si no lo está

    public Categoria() {
    }
    
    // Constructor
    public Categoria(int idCategoria, String descripcion, String tipo, boolean activo) {
        this.idCategoria = idCategoria;
        this.descripcion = descripcion;
        this.tipo = tipo;
        this.activo = activo;
    }

   public int getIdCategoria() {
        return idCategoria;
    }

    public void setIdCategoria(int idCategoria) {
        this.idCategoria = idCategoria;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public boolean getActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }
    
}
