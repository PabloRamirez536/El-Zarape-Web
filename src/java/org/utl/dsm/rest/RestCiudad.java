/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package org.utl.dsm.rest;
import com.google.gson.Gson;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import org.utl.dsm.controller.ControllerCiudad;
import org.utl.dsm.model.Ciudad;

/**
 *
 * @author ramir
 */
@Path("ciudad")
public class RestCiudad {

    @GET
    @Path("getCiudadesPorEstado")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCiudadesPorEstado(@QueryParam("idEstado") int idEstado) {
        ControllerCiudad controller = new ControllerCiudad();
        Gson gson = new Gson();
        String out;
        try {
            List<Ciudad> ciudades = controller.getCiudadesPorEstado(idEstado);
            out = gson.toJson(ciudades);
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"result\":\"Error al obtener ciudades\"}";
        }
        return Response.ok(out).build();
    }
}
