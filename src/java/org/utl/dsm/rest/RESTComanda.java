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
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import org.utl.dsm.controller.ControllerBebida;
import org.utl.dsm.controller.ControllerComanda;
import org.utl.dsm.model.Bebida;
import org.utl.dsm.model.Comanda;

/**
 *
 * @author Miguel Hernandez
 */
@Path("comanda")
public class RESTComanda {
    
     @Path("getAllComandaGeneral")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllComandaGeneral(

           ) {  // Recibimos el parámetro estatus
        List<Comanda> lista = null;
        Gson gson = new Gson();
        String out = null;
        ControllerComanda cc = null;
        try {
            cc = new ControllerComanda();
                lista = cc.getComanda();  // Implementar el filtro por estatus
            out = gson.toJson(lista);
        } catch (Exception e) {
            e.printStackTrace();
            out = """
              {"result":"Error de servidor"}
              """;
        }
        return Response.ok(out).build();
    }
    @Path("getAllComanda")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllComanda(
            @QueryParam("id") @DefaultValue("0") int id,
            @QueryParam("estatus") @DefaultValue("") String estatus) {  // Recibimos el parámetro estatus
        List<Comanda> lista = null;
        Gson gson = new Gson();
        String out = null;
        ControllerComanda cc = null;
        try {
            cc = new ControllerComanda();
                lista = cc.getComandasPorEstatus(estatus);  // Implementar el filtro por estatus
            out = gson.toJson(lista);
        } catch (Exception e) {
            e.printStackTrace();
            out = """
              {"result":"Error de servidor"}
              """;
        }
        return Response.ok(out).build();
    }
    
    @Path("updateEstatus")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateEstatus(
            @FormParam("datosComanda") @DefaultValue("") String comanda) {  // Recibimos el parámetro estatus
        ControllerComanda cu = new ControllerComanda();

        Comanda co = null;
        Gson gson = new Gson();
        String out;
        System.out.println(comanda);
        try {
            co = gson.fromJson(comanda, Comanda.class);
            // Aquí puedes procesar la imagen si la necesitas
            // Foto procesada como InputStream, por ejemplo, guardarla en el servidor

            ControllerComanda controller = new ControllerComanda();
            controller.updateEstatusComanda(co);
            out = "{\"result\":\"Comanda actualizada con éxito\"}";
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"result\":\"Error en la actualización\"}";
        }

        return Response.ok(out).build();
    }
}
