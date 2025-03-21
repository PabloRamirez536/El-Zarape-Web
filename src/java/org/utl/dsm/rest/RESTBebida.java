/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package org.utl.dsm.rest;

import com.google.gson.Gson;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.sql.SQLException;
import java.util.List;
import org.utl.dsm.controller.ControllerBebida;
import org.utl.dsm.controller.ControllerUsuario;
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
            @FormParam("datosBebida") @DefaultValue("") String bebida,
            @FormParam("token") String token // Obtiene el token del encabezado
    ) throws Exception {
        ControllerUsuario cu = new ControllerUsuario();

        if (cu.validateToken(token) == null) {
           return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("{\"message\": \"Error al insertar la bebida\"}")
                    .build();
        }

        System.out.println(bebida);
        Gson gson = new Gson();
        ControllerBebida cp = new ControllerBebida();
        Bebida b = gson.fromJson(bebida, Bebida.class);
        System.out.println("Bebida:" + b.getProducto().getNombre());

        try {
            cp.insertBebidaObjeto(b);
            String out = gson.toJson(b);
            return Response.status(Response.Status.CREATED).entity(out).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"message\": \"Error al insertar la bebida\"}")
                    .build();
        }
    }

    @Path("updateBebida")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateBebida(
            @FormParam("datosBebida") @DefaultValue("") String bebidaJson,
            @FormParam("token") String token // Obtiene el token del encabezado
    ) throws Exception {
        ControllerUsuario cu = new ControllerUsuario();

        if (cu.validateToken(token) == null) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("{\"message\": \"Error al actualizar la bebida\"}")
                    .build();
        }

        Bebida bebida;
        Gson gson = new Gson();
        String out;

        try {
            bebida = gson.fromJson(bebidaJson, Bebida.class);
            ControllerBebida controller = new ControllerBebida();
            controller.updateBebidaObjeto(bebida);
            out = "{\"result\":\"Bebida actualizada con éxito\"}";
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"result\":\"Error en la actualización\"}";
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(out).build();
        }

        return Response.ok(out).build();
    }

    @Path("getAllBebida")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllBebida(@QueryParam("token") String token) throws Exception {
        ControllerUsuario cu = new ControllerUsuario();

        if (cu.validateToken(token) == null) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("{\"message\": \"Error al traer las bebida\"}")
                    .build();
        }
        List<Bebida> lista;
        Gson gson = new Gson();

        try {
            ControllerBebida cs = new ControllerBebida();
            lista = cs.getAllObjetoBebida();
            String out = gson.toJson(lista);
            return Response.ok(out).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("{\"result\":\"Error de servidor\" \"token:\" " +token+"\" }")
                    .build();
        }
    }

    @Path("getAllCategoriaBebida")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllCategoriaBebida(@QueryParam("id") @DefaultValue("0") int id) {
        List<Categoria> lista;
        Gson gson = new Gson();

        try {
            ControllerBebida cs = new ControllerBebida();
            lista = cs.getAllCategoriaBebida();
            String out = gson.toJson(lista);
            return Response.ok(out).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"result\":\"Error de servidor\"}")
                    .build();
        }
    }

    @Path("eliminarBebida")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response eliminarBebida(
            @FormParam("idProducto") int idProducto,
            @FormParam("token") String token // Obtiene el token del encabezado
    ) throws Exception{
        ControllerUsuario cu = new ControllerUsuario();

        if (cu.validateToken(token) == null) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("{\"message\": \"Error al eliminar la bebida\"}")
                    .build();
        }

        String out;
        ControllerBebida cp = new ControllerBebida();
        try {
            cp.eliminarBebida(idProducto);
            out = "{\"result\":\"Registro eliminado correctamente\"}";
        } catch (SQLException e) {
            e.printStackTrace();
            out = "{\"result\":\"Error al eliminar el registro\"}";
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(out).build();
        }
        return Response.ok(out).build();
    }
}
