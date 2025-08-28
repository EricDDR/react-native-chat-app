package org.example.service;

import org.example.models.Message;
import org.example.repository.MessageRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {
    private final MessageRepository repository;

    public MessageService(MessageRepository repository) {
        this.repository = repository;
    }

    public List<Message> getAllMessages() {
        return repository.findAll();
    }

    public Message saveMessage(Message message) {
        return repository.save(message);
    }
}
