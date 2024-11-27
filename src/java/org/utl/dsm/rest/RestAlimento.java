
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
import jakarta.ws.rs.core.Application;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import java.sql.SQLException;
import org.utl.dsm.controller.ControllerAlimento;
import org.utl.dsm.controller.ControllerBebida;
import org.utl.dsm.model.Alimento;
import org.utl.dsm.model.Categoria;
import org.utl.dsm.model.Producto;

@Path("alimento")
public class RestAlimento extends Application {

    @Path("getAllAlimento")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllAlimento(@QueryParam("id") @DefaultValue("0") int id) {
        List<Alimento> lista = null;
        Gson gson = new Gson();
        String out = null;
        ControllerAlimento cs = new ControllerAlimento();
        try {
            lista = cs.getAllAlimento();
            out = gson.toJson(lista);
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"result\":\"Error: " + e.getMessage() + "\"}";
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(out).build();
        }
        return Response.ok(out).build();
    }
    
    
    @Path("insertAlimento")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response insertAlimento(
            @FormParam("datosAlimento") @DefaultValue("") String alimento
    ) {
        System.out.println(alimento);
        Gson gson = new Gson();
        ControllerAlimento cp = new ControllerAlimento();
        Alimento a = gson.fromJson(alimento, Alimento.class);
        System.out.println("Bebida:" + a.getProducto().getNombre());
        cp.insertAlimentoObjeto(a);
        String out = gson.toJson(a);
        return Response.status(Response.Status.CREATED).entity(out).build();
    }
    
    @Path("updateAlimento")
@POST
@Produces(MediaType.APPLICATION_JSON)
public Response updateAlimento(@FormParam("datosAlimento") @DefaultValue("") String alimentoJson) {
    Alimento alimento = null;
    Gson gson = new Gson();
    String out;
    System.out.println(alimentoJson);
    try {
        alimento = gson.fromJson(alimentoJson, Alimento.class);
        // Aquí puedes procesar la imagen si la necesitas
        // Foto procesada como InputStream, por ejemplo, guardarla en el servidor

        ControllerAlimento controller = new ControllerAlimento();
        controller.updateAlimentoObjeto(alimento);
        out = "{\"result\":\"Bebida actualizada con éxito\"}";
    } catch (Exception e) {
        e.printStackTrace();
        out = "{\"result\":\"Error en la actualización\"}";
    }

    return Response.ok(out).build();
}

    
    @Path("eliminarAlimento")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteAlimento(@FormParam("idProducto") int idProducto) throws SQLException {
        System.out.println(idProducto);
        String out;
        ControllerAlimento cp = new ControllerAlimento();
        cp.eliminarAlimento(idProducto);
        out = """
                          {"result":"Registro eliminado correctamente"}
                      """;
        return Response.ok(out).build();
    }
    
@Path("getAllCategoriaAlimento")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllCategoriaAlimento(@QueryParam("id") @DefaultValue("0") int id) {
        List<Categoria> lista = null;
        Gson gson = new Gson();
        String out = null;
        ControllerAlimento cs = null;
        try {
            cs = new ControllerAlimento();
            lista = cs.getAllCategoriaAlimento();
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
