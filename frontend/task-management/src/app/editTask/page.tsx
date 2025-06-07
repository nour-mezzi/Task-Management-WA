'use client';

import React, { useState, useEffect } from 'react';
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

import '@/styles/auth.css';

interface Task {
    id: string;
    title: string;
    category: string;
    description?: string;
    dueDate?: Date | string | null;
}

interface EditTaskFormProps {
    initialTaskData: Task;
    categories: { value: string; label: string; }[];
    onSave?: (updatedTask: Task) => void;
    onCancel?: () => void;
}

const EditTaskForm: React.FC<EditTaskFormProps> = ({
    initialTaskData,
    categories,
    onSave,
    onCancel
}) => {
    const [taskTitle, setTaskTitle] = useState(initialTaskData.title);
    const [selectedCategory, setSelectedCategory] = useState(initialTaskData.category);
    const [taskDescription, setTaskDescription] = useState(initialTaskData.description || '');
    const [dueDate, setDueDate] = useState<Date | undefined>(
        initialTaskData.dueDate instanceof Date
            ? initialTaskData.dueDate
            : (initialTaskData.dueDate ? new Date(initialTaskData.dueDate) : undefined)
    );

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

        const updatedTaskData: Task = {
            ...initialTaskData,
            title: taskTitle,
            category: selectedCategory,
            description: taskDescription,
            dueDate: dueDate || null,
        };

        console.log('Attempting to Update Task:', updatedTaskData);

        try {
            const response = await fetch(`/api/tasks/${initialTaskData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTaskData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Task update failed:', errorData);
                alert(`Failed to update task: ${errorData.message || response.statusText}`);
                return;
            }

            const savedTask = await response.json();
            console.log('Task updated successfully:', savedTask);

            if (onSave) {
                onSave(savedTask || updatedTaskData);
            }

        } catch (error) {
            console.error('Error submitting task update:', error);
            alert('An unexpected error occurred while updating the task.');
        }
    };

    return (
        <div className="split-layout-card-section">
            <Card className="w-full max-w-sm split-layout-the-card">
                <CardHeader>
                    <CardTitle>Edit Task</CardTitle>
                    <CardDescription>Modify task details and save changes</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-task-title">Task Title</Label>
                                <Input
                                    id="edit-task-title"
                                    type="text"
                                    placeholder="e.g., Buy groceries"
                                    required
                                    value={taskTitle}
                                    onChange={(e) => setTaskTitle(e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="edit-task-category">Category</Label>
                                <Select
                                    value={selectedCategory}
                                    onValueChange={setSelectedCategory}
                                    required
                                >
                                    <SelectTrigger id="edit-task-category">
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
                                <Label htmlFor="edit-task-description">Description (Optional)</Label>
                                <Textarea
                                    id="edit-task-description"
                                    placeholder="Add details about the task..."
                                    value={taskDescription}
                                    onChange={(e) => setTaskDescription(e.target.value)}
                                />
                            </div>

                             <div className="grid gap-2">
                                <Label htmlFor="edit-task-due-date">Due Date (Optional)</Label>
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
                         <CardFooter className="flex justify-end gap-2 p-0 pt-6">
                            {onCancel && (
                                <Button type="button" variant="outline" onClick={onCancel}>
                                    Cancel
                                </Button>
                            )}
                            <Button type="submit">Save Changes</Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default EditTaskForm;