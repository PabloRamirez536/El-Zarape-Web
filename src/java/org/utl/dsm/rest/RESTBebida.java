/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package org.utl.dsm.rest;

import com.google.gson.Gson;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.sql.SQLException;
import java.util.Base64;
import java.util.List;
import org.utl.dsm.controller.ControllerBebida;
import org.utl.dsm.model.Bebida;
import org.utl.dsm.model.Categoria;

/**
 *
 * @author Miguel Hernandez
 */
@Path("bebida")
public class RESTBebida {

    @Path("insertBebida")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response insertBebida(
            @FormParam("datosBebida") @DefaultValue("") String bebida
    ) {
        System.out.println(bebida);
        Gson gson = new Gson();
        ControllerBebida cp = new ControllerBebida();
        Bebida b = gson.fromJson(bebida, Bebida.class);
        System.out.println("Bebida:" + b.getProducto().getNombre());
        cp.insertBebidaObjeto(b);
        String out = gson.toJson(b);
        return Response.status(Response.Status.CREATED).entity(out).build();
    }

    @Path("updateBebida")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateBebida(@FormParam("datosBebida") @DefaultValue("") String bebidaJson) {
        Bebida bebida = null;
        Gson gson = new Gson();
        String out;
        System.out.println(bebidaJson);
        try {
            bebida = gson.fromJson(bebidaJson, Bebida.class);
            // Aquí puedes procesar la imagen si la necesitas
            // Foto procesada como InputStream, por ejemplo, guardarla en el servidor

            ControllerBebida controller = new ControllerBebida();
            controller.updateBebidaObjeto(bebida);
            out = "{\"result\":\"Bebida actualizada con éxito\"}";
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"result\":\"Error en la actualización\"}";
        }

        return Response.ok(out).build();
    }

    @Path("getAllBebida")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllBebida(@QueryParam("id") @DefaultValue("0") int id) {
        List<Bebida> lista = null;
        Gson gson = new Gson();
        String out = null;
        ControllerBebida cs = null;
        try {
            cs = new ControllerBebida();
            lista = cs.getAllObjetoBebida();
            out = gson.toJson(lista);
        } catch (Exception e) {
            e.printStackTrace();
            out = """
              {"result":"Error de servidor"}
              """;
        }
        return Response.ok(out).build();
    }

    @Path("getAllCategoriaBebida")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllCategoriaBebida(@QueryParam("id") @DefaultValue("0") int id) {
        List<Categoria> lista = null;
        Gson gson = new Gson();
        String out = null;
        ControllerBebida cs = null;
        try {
            cs = new ControllerBebida();
            lista = cs.getAllCategoriaBebida();
            out = gson.toJson(lista);
        } catch (Exception e) {
            e.printStackTrace();
            out = """
              {"result":"Error de servidor"}
              """;
        }
        return Response.ok(out).build();
    }

    @Path("eliminarBebida")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response deletePersona(@FormParam("idProducto") int idProducto) {
        System.out.println(idProducto);
        String out;
        ControllerBebida cp = new ControllerBebida();
        try {
            cp.eliminarBebida(idProducto);
            out = """
                {"result":"Registro eliminado correctamente"}
            """;
        } catch (SQLException e) {
            e.printStackTrace();
            out = """
                {"result":"Error al eliminar el registro"}
            """;
        }
        return Response.ok(out).build();
    }
}
