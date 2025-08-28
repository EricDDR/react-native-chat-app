package org.example.Controller;

import org.example.models.Message;
import org.example.service.MessageService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/messages")
@CrossOrigin(origins = "*")
public class MessageController {
    private final MessageService service;

    public MessageController(MessageService service) {
        this.service = service;
    }

    @GetMapping
    public List<Message> getMessages() {
        return service.getAllMessages();
    }

    @PostMapping
    public Message postMessage(@RequestBody Message message) {
        return service.saveMessage(message);
    }
}
