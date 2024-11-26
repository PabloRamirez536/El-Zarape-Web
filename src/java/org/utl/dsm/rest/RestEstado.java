/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package org.utl.dsm.rest;
import com.google.gson.Gson;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import org.utl.dsm.controller.ControllerEstado;
import org.utl.dsm.model.Estado;

/**
 *
 * @author ramir
 */
@Path("estado")
public class RestEstado {

    @GET
    @Path("getAllEstados")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllEstados() {
        ControllerEstado controller = new ControllerEstado();
        Gson gson = new Gson();
        String out;
        try {
            List<Estado> estados = controller.getAllEstados();
            out = gson.toJson(estados);
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"result\":\"Error al obtener estados\"}";
        }
        return Response.ok(out).build();
    }
}