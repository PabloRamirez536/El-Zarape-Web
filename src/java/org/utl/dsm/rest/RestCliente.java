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
    public Response getAllClientes(@QueryParam("id") @DefaultValue("0") int id) {
        List<Cliente> lista = null;
        Gson gson = new Gson();
        String out = null;
        ControllerCliente cs = null;

        try {
            cs = new ControllerCliente();
            lista = cs.getAllClientes(); // Método en el controlador para obtener los clientes
            out = gson.toJson(lista); // Convertir la lista a JSON
        } catch (Exception e) {
            e.printStackTrace();
            out = """
            {"result":"Error de servidor"}
            """;
        }
        return Response.ok(out).build();
    }

    @Path("insertarCliente")
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
            @FormParam("datosCliente") @DefaultValue("") String datosCliente
    ) {
        String out = "";
        try {
            Gson gson = new Gson();
            ControllerCliente controllerCliente = new ControllerCliente();

            // Convertir el JSON recibido a un objeto Cliente
            Cliente cliente = gson.fromJson(datosCliente, Cliente.class);

            // Llamar al método para insertar el cliente
            controllerCliente.actualizarCliente(cliente);

            // Convertir el cliente nuevamente a JSON para la respuesta
            out = gson.toJson(cliente);
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"error\":\"Error al actualizar el cliente. Por favor, verifica los datos y vuelve a intentarlo.\"}";
        }
        return Response.ok(out).build();
    }

    @Path("eliminarCliente")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public Response eliminarCliente(@FormParam("idCliente") int idCliente) {
        ControllerCliente controller = new ControllerCliente();
        try {
            controller.eliminarCliente(idCliente); // Llamada a la función de eliminación lógica
            return Response.ok("{\"result\":\"Cliente eliminado correctamente\"}").build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("{\"result\":\"Error al eliminar cliente\"}").build();
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
