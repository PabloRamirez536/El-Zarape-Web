package org.utl.dsm.rest;

import com.google.gson.Gson;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.sql.SQLException;
import org.utl.dsm.model.Categoria;
import org.utl.dsm.controller.ControllerCategoria;
import java.util.List;

@Path("categoria")
public class RESTCategoria {

    @Path("insertCategoria")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response insertCategoria(@FormParam("datosCategoria") @DefaultValue("") String categoria) {
        Gson gson = new Gson();
        ControllerCategoria cc = new ControllerCategoria();
        Categoria c = gson.fromJson(categoria, Categoria.class);
        cc.insertCategoria(c);
        String out = gson.toJson(c);
        return Response.status(Response.Status.CREATED).entity(out).build();
    }

    @Path("updateCategoria")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateCategoria(@FormParam("datosCategoria") @DefaultValue("") String categoria) {
        Gson gson = new Gson();
        String out;
        try {
            ControllerCategoria cc = new ControllerCategoria();
            Categoria c = gson.fromJson(categoria, Categoria.class);
            cc.update(c);
            out = """
              {"result":"Cambios Realizados"}
              """;
        } catch (Exception e) {
            e.printStackTrace();
            out = """
              {"result":"Error de servidor"}
              """;
        }
        return Response.ok(out).build();
    }

    @Path("getAllCategoria")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllCategoria() {
        List<Categoria> lista = null;
        Gson gson = new Gson();
        String out;
        try {
            ControllerCategoria cc = new ControllerCategoria();
            lista = cc.getAllCategorias();
            out = gson.toJson(lista);
        } catch (Exception e) {
            e.printStackTrace();
            out = """
              {"result":"Error de servidor"}
              """;
        }
        return Response.ok(out).build();
    }

    @Path("eliminarCategoria")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteCategoria(@FormParam("idCategoria") int idCategoria) throws SQLException {
        String out;
        ControllerCategoria cc = new ControllerCategoria();
        cc.delete(idCategoria);
        out = """
                          {"result":"Categoria desactivada correctamente"}
                      """;
        return Response.ok(out).build();
    }
}
