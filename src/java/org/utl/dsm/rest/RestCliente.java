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
import java.util.List;
import org.utl.dsm.controller.ControllerCliente;
import org.utl.dsm.controller.ControllerUsuario;
import org.utl.dsm.model.Cliente;

/**
 *
 * @author ramir
 */
@Path("cliente")
public class RestCliente {

    @Path("getAllClientes")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllClientes(@QueryParam("token") String token) throws Exception {
        ControllerUsuario cu = new ControllerUsuario();
        if (cu.validateToken(token) == null) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("{\"error\": \"Token no válido\"}").build();
        }

        List<Cliente> lista;
        Gson gson = new Gson();
        String out;

        try {
            ControllerCliente cs = new ControllerCliente();
            lista = cs.getAllClientes();
            out = gson.toJson(lista);
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"result\":\"Error de servidor\"}";
        }
        return Response.ok(out).build();
    }
    
    @Path("insertarCliente")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public Response insertCliente(
            @FormParam("datosCliente") String datosCliente,
            @FormParam("token") String token) throws Exception {
        
        ControllerUsuario cu = new ControllerUsuario();
        if (cu.validateToken(token) == null) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("{\"error\": \"Token no válido\"}").build();
        }

        String out;
        try {
            Gson gson = new Gson();
            ControllerCliente controllerCliente = new ControllerCliente();
            Cliente cliente = gson.fromJson(datosCliente, Cliente.class);
            controllerCliente.insertarCliente(cliente);
            out = gson.toJson(cliente);
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"error\":\"Error al insertar el cliente.\"}";
        }
        return Response.ok(out).build();
    }

    @Path("insertarCliente1")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public Response insertCliente(
            @FormParam("datosCliente") @DefaultValue("") String datosCliente
    ) {
        String out = "";
        try {
            Gson gson = new Gson();
            ControllerCliente controllerCliente = new ControllerCliente();

            // Convertir el JSON recibido a un objeto Cliente
            Cliente cliente = gson.fromJson(datosCliente, Cliente.class);

            // Llamar al método para insertar el cliente
            controllerCliente.insertarCliente(cliente);

            // Convertir el cliente nuevamente a JSON para la respuesta
            out = gson.toJson(cliente);
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"error\":\"Error al insertar el cliente. Por favor, verifica los datos y vuelve a intentarlo.\"}";
        }
        return Response.ok(out).build();
    }
    
    @Path("actualizarCliente")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public Response actualizarCliente(
            @FormParam("datosCliente") String datosCliente,
            @FormParam("token") String token) throws Exception {

        ControllerUsuario cu = new ControllerUsuario();
        if (cu.validateToken(token) == null) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("{\"error\": \"Token no válido\"}").build();
        }

        String out;
        try {
            Gson gson = new Gson();
            ControllerCliente controllerCliente = new ControllerCliente();
            Cliente cliente = gson.fromJson(datosCliente, Cliente.class);
            controllerCliente.actualizarCliente(cliente);
            out = gson.toJson(cliente);
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"error\":\"Error al actualizar el cliente.\"}";
        }
        return Response.ok(out).build();
    }
    
    @Path("actualizarCliente1")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public Response actualizarCliente1(
            @FormParam("datosCliente") String datosCliente) throws Exception {
        String out;
        try {
            Gson gson = new Gson();
            ControllerCliente controllerCliente = new ControllerCliente();
            Cliente cliente = gson.fromJson(datosCliente, Cliente.class);
            controllerCliente.actualizarCliente(cliente);
            out = gson.toJson(cliente);
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"error\":\"Error al actualizar el cliente.\"}";
        }
        return Response.ok(out).build();
    }

    @Path("eliminarCliente")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public Response eliminarCliente(@FormParam("idCliente") int idCliente,
            @FormParam("token") String token) throws Exception {

        ControllerUsuario cu = new ControllerUsuario();
        if (cu.validateToken(token) == null) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("{\"error\": \"Token no válido\"}").build();
        }

        ControllerCliente controller = new ControllerCliente();
        try {
            controller.eliminarCliente(idCliente);
            return Response.ok("{\"result\":\"Cliente eliminado correctamente\"}").build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"result\":\"Error al eliminar cliente\"}").build();
        }
    }

    @Path("getClientePorId")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getClientePorId(@QueryParam("idCliente") int idCliente) {
        Cliente cliente;
        Gson gson = new Gson();
        String out;

        try {
            ControllerCliente controller = new ControllerCliente();
            cliente = controller.getClientePorId(idCliente);

            // Si el cliente es null, devuelve un mensaje de error
            if (cliente == null) {
                out = "{\"error\":\"Cliente no encontrado\"}";
                return Response.status(Response.Status.NOT_FOUND).entity(out).build();
            }

            out = gson.toJson(cliente); // Convertir el cliente a JSON
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"error\":\"Error al obtener el cliente.\"}";
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(out).build();
        }

        return Response.ok(out).build();
    }

}
