'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import '@/styles/auth.css'

const CreateTask: React.FC = () => {
    const [taskTitle, setTaskTitle] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [dueDate, setDueDate] = useState<Date | undefined>(undefined);

    const categories = [
        { value: 'work', label: 'Work' },
        { value: 'personal', label: 'Personal' },
        { value: 'shopping', label: 'Shopping' },
        { value: 'errands', label: 'Errands' },
        { value: 'project-x', label: 'Project X' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!taskTitle.trim()) {
            alert('Please enter a task title.');
            return;
        }
         if (!selectedCategory) {
            alert('Please select a category.');
            return;
        }

        const taskData = {
            title: taskTitle,
            category: selectedCategory,
            description: taskDescription,
            dueDate: dueDate ? dueDate.toISOString() : null,
        };

        console.log('Attempting to Create Task:', taskData);

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Task creation failed:', errorData);
                alert(`Failed to create task: ${errorData.message || response.statusText}`);
                return;
            }

            const createdTask = await response.json();
            console.log('Task created successfully:', createdTask);

            setTaskTitle('');
            setSelectedCategory('');
            setTaskDescription('');
            setDueDate(undefined);

        } catch (error) {
            console.error('Error submitting task:', error);
            alert('An unexpected error occurred while creating the task.');
        }
    };

    return (
        <div className="split-layout-card-section">
            <Card className="w-full max-w-sm split-layout-the-card">
                <CardHeader>
                    <CardTitle>Create New Task</CardTitle>
                    <CardDescription>Enter task details and assign a category</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="task-title">Task Title</Label>
                                <Input
                                    id="task-title"
                                    type="text"
                                    placeholder="e.g., Buy groceries"
                                    required
                                    value={taskTitle}
                                    onChange={(e) => setTaskTitle(e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="task-category">Category</Label>
                                <Select
                                    value={selectedCategory}
                                    onValueChange={setSelectedCategory}
                                    required
                                >
                                    <SelectTrigger id="task-category">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.value} value={category.value}>
                                                {category.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="task-description">Description (Optional)</Label>
                                <Textarea
                                    id="task-description"
                                    placeholder="Add details about the task..."
                                    value={taskDescription}
                                    onChange={(e) => setTaskDescription(e.target.value)}
                                />
                            </div>

                             <div className="grid gap-2">
                                <Label htmlFor="task-due-date">Due Date (Optional)</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !dueDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={dueDate}
                                            onSelect={setDueDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                        </div>
                         <CardFooter className="flex-col gap-2 p-0 pt-6">
                            <Button type="submit" className="w-full">Create Task</Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateTask;