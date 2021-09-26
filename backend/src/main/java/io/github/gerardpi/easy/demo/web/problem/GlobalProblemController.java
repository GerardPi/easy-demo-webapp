package io.github.gerardpi.easy.demo.web.problem;

import io.vavr.Tuple2;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;
import java.time.OffsetDateTime;
import java.util.function.Supplier;

@RestController
@RequestMapping(GlobalProblemController.URI)
public class GlobalProblemController implements org.springframework.boot.web.servlet.error.ErrorController {
    private static final Logger LOG = LoggerFactory.getLogger(GlobalProblemController.class);

    public static final String URI = "/api/problems";
    private final Supplier<OffsetDateTime> dateTimeSupplier;

    public GlobalProblemController(Supplier<OffsetDateTime> dateTimeSupplier) {
        this.dateTimeSupplier = dateTimeSupplier;
    }

    @GetMapping
    public HttpEntity<RestApiMessageDto> handleError(HttpServletRequest request) {
        OffsetDateTime offsetDateTime = dateTimeSupplier.get();
        Tuple2<HttpStatus, String> httpStatusAndPath = determineStatusAndPath(request);
        HttpStatus httpStatus = httpStatusAndPath._1;
        String requestedPath = httpStatusAndPath._2;

        RestApiMessageDto result = RestApiMessageDto.create()
                .setMethod(request.getMethod())
                .setStatusCode(httpStatus.value())
                .setStatusName(httpStatus.name())
                .setStatusSeries(httpStatus.series().name())
                .setTitle("Problem report")
                .addMessage(httpStatus.getReasonPhrase())
                .setTraceId(offsetDateTime.toInstant().toEpochMilli())
                .setPath(requestedPath)
                .setTimestamp(offsetDateTime)
                .build();
        LOG.warn("Problem: {}", result);
        return ResponseEntity
                .status(httpStatusAndPath._1)
                .body(result);
    }

    private Tuple2<HttpStatus, String> determineStatusAndPath(HttpServletRequest request) {
        Object statusCode = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        Object pathInfo = request.getAttribute(RequestDispatcher.ERROR_REQUEST_URI);
        if (statusCode != null) {
            HttpStatus httpStatus = HttpStatus.resolve((Integer) statusCode);
            return new Tuple2<>(httpStatus, (String) pathInfo);
        } else {
            return new Tuple2<>(HttpStatus.BAD_REQUEST, request.getPathInfo());
        }
    }
}
