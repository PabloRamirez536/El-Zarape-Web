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
import org.utl.dsm.controller.ControllerEmpleado;
import org.utl.dsm.model.Empleado;
import org.utl.dsm.model.Sucursal;

/**
 *
 * @author ramir
 */
@Path("empleado")
public class RESTEmpleado {
    
    @Path("getAllEmpleados")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllEmpleados(@QueryParam("id") @DefaultValue("0") int id) {
        List<Empleado> lista = null;
        Gson gson = new Gson();
        String out = null;
        ControllerEmpleado cs = null;

        try {
            cs = new ControllerEmpleado();
            lista = cs.getAllEmpleados();
            out = gson.toJson(lista); 
        } catch (Exception e) {
            e.printStackTrace();
            out = """
            {"result":"Error de servidor"}
            """;
        }
        return Response.ok(out).build();
    }

    @Path("insertarEmpleado")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public Response insertEmpleado(
            @FormParam("datosEmpleado") @DefaultValue("") String datosEmpleado
    ) {
        String out = "";
        try {
            Gson gson = new Gson();
            ControllerEmpleado controllerEmpleado = new ControllerEmpleado();

            Empleado empleado = gson.fromJson(datosEmpleado, Empleado.class);

            controllerEmpleado.insertarEmpleado(empleado);

            // Convertir el cliente nuevamente a JSON para la respuesta
            out = gson.toJson(empleado);
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"error\":\"Error al insertar el Empleado. Por favor, verifica los datos y vuelve a intentarlo.\"}";
        }
        return Response.ok(out).build();
    }

    @Path("actualizarEmpleado")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public Response actualizarEmpleado(
            @FormParam("datosEmpleado") @DefaultValue("") String datosEmpleado
    ) {
        String out = "";
        try {
            Gson gson = new Gson();
            ControllerEmpleado controllerEmpleado = new ControllerEmpleado();

            Empleado empleado = gson.fromJson(datosEmpleado, Empleado.class);

            controllerEmpleado.actualizarEmpleado(empleado);

            // Convertir el cliente nuevamente a JSON para la respuesta
            out = gson.toJson(empleado);
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"error\":\"Error al actualizar el Empleado. Por favor, verifica los datos y vuelve a intentarlo.\"}";
        }
        return Response.ok(out).build();
    }

    @Path("eliminarEmpleado")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public Response eliminarEmpleado(@FormParam("idEmpleado") int idEmpleado) {
        ControllerEmpleado controllerEmpleado = new ControllerEmpleado();
        try {
            controllerEmpleado.eliminarEmpleado(idEmpleado); // Llamada a la función de eliminación lógica
            return Response.ok("{\"result\":\"Empleado eliminado correctamente\"}").build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("{\"result\":\"Error al eliminar cliente\"}").build();
        }
    }
    
    @Path("getAllSucursalesActivas")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllSucursales(@QueryParam("id") @DefaultValue("0") int id) {
        List<Sucursal> lista = null;
        Gson gson = new Gson();
        String out = null;
        ControllerEmpleado cs = null;

        try {
            cs = new ControllerEmpleado();
            lista = cs.getAllSucursalesAct();
            out = gson.toJson(lista);
        } catch (Exception e) {
            e.printStackTrace();
            out = """
              {"result":"Error de servidor"}
              """;
        }
        return Response.ok(out).build();
    }
    
    
    
}
