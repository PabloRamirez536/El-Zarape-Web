package org.utl.dsm.model;

public class Alimento {
    private int idAlimento;
    private int idProducto;
    private Producto producto;
    private Categoria categoria;

    public Alimento() {
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    public int getIdAlimento() {
        return idAlimento;
    }

    public void setIdAlimento(int idAlimento) {
        this.idAlimento = idAlimento;
    }

    public int getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(int idProducto) {
        this.idProducto = idProducto;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }

    @Override
    public String toString() {
        return "Alimento{" + "idAlimento=" + idAlimento + ", idProducto=" + idProducto + ", producto=" + producto + ", categoria=" + categoria + '}';
    }
    
    
}
